'use client';

import { useMutation, useQuery } from '@apollo/client';
import { omitDeep } from '@apollo/client/utilities';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { cloneDeep, isEmpty, isEqual, pick } from 'lodash';
import { getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import { TConductorInstance } from 'react-canvas-confetti/dist/types';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/Button';
import IssueModal from '@/components/IssueModal';
import IssueModalContents from '@/components/IssueModal/IssueModalContents';
import Toolbar from '@/components/KanbanBoard/Toolbar';
import {
  ADD_ITEM_TO_VIEW_STATE,
  CREATE_ISSUE_MUTATION,
  CREATE_ISSUE_STATUS_MUTATION,
  GET_ME,
  GET_PROJECT_INFO,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import useWsAuthenticatedSocket from '@/hooks/useWsAuthenticatedSocket';
import { getDomainName } from '@/services/utils';

// Components
import Container from './Container';
import Input from './Input';
import Items from './Item';
import Modal from './Modal';

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    status: any;
  }[];
};

interface PageState {
  containers: DNDType[];
  activeId: UniqueIdentifier | string | null;
  currentContainerId: UniqueIdentifier | string | null;
  containerName: string;
  itemName: string;
  boardVersion: number;
}

export default function KanbanBoard({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) {
  const searchParams = useSearchParams()!;
  const selectedIssueId = searchParams.get('selectedIssueId');

  const [conductor, setConductor] = useState<TConductorInstance>();
  const { sendJsonMessage } = useWsAuthenticatedSocket();
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [pageState, setPageState] = useState<PageState>({
    containers: [],
    activeId: null,
    currentContainerId: null,
    containerName: '',
    itemName: '',
    boardVersion: 0,
  });

  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    setConductor(conductor);
  };

  const { containers, activeId, currentContainerId, containerName, itemName } =
    pageState;

  const [createIssue] = useMutation(CREATE_ISSUE_MUTATION);
  const [updateIssue] = useMutation(UPDATE_ISSUE_MUTATION);
  const [addIssueStatus] = useMutation(CREATE_ISSUE_STATUS_MUTATION);
  const [addItemToViewState] = useMutation(ADD_ITEM_TO_VIEW_STATE);

  const getMe = useQuery(GET_ME);
  const getProjectInfo = useQuery(GET_PROJECT_INFO, {
    skip: !projectId,
    fetchPolicy: 'network-only',
    variables: {
      input: { id: `${projectId}` },
    },
  });

  // On page load we open the modal if there is a query param for the issue
  useEffect(() => {
    if (selectedIssueId && !isIssueModalOpen) {
      setIsIssueModalOpen(true);
    } else if (!selectedIssueId && isIssueModalOpen) {
      setIsIssueModalOpen(false);
    }
  }, [selectedIssueId]);

  // TODO: FIX
  const onAddContainer = async () => {
    if (!containerName) return;

    const newIssueStatusResp = await addIssueStatus({
      variables: { input: { projectId, name: containerName } },
    });

    const newIssueStatus = newIssueStatusResp.data.createIssueStatus;

    const id = `container-${newIssueStatus.id}`;
    setPageState((prevState) => {
      return {
        ...prevState,
        containerName: '',
        containers: [
          ...prevState.containers,
          {
            id,
            title: containerName,
            items: [],
          },
        ],
      };
    });
    setShowAddContainerModal(false);
  };

  const onAddItem = async () => {
    if (!itemName) return;
    const newContainers = cloneDeep(containers);
    const container = newContainers.find(
      (item) => item.id === currentContainerId
    );
    if (!container) return;

    // TODO: Temporary until we decouple the issue status from the container
    const issueStatusId = getProjectInfo.data.project.issueStatuses.find(
      (issueStatus: any) =>
        issueStatus.name.toLowerCase() === container.title.toLowerCase()
    )?.id;

    // Create the item in backend
    const newIssueResp = await createIssue({
      variables: {
        input: {
          projectId: `${projectId}`,
          title: itemName,
          description: '',
          issueStatusId: `${
            issueStatusId ?? getProjectInfo.data.project.issueStatuses[0].id
          }`,
        },
      },
    });

    await getProjectInfo.refetch();

    const newIssue = newIssueResp.data.createIssue;

    const session = await getSession();

    const notification = {
      type: 'NOTIFICATION',
      payload: {
        id: uuidv4(),
        title: 'New issue Created',
        message: `Ticket title: ${itemName}`,
        topic: `user:${session?.user?.id}`,
        tags: ['white_check_mark', 'openpro.notificationDuration=3000'],
        click: `${getDomainName()}/projects/${projectId}/boards/${boardId}/?selectedIssueId=${
          newIssue.id
        }`,
      },
    };

    sendJsonMessage(notification);

    container.items.push({
      id: `item-${newIssue.id}`,
      title: itemName,
      status: omitDeep(newIssue.status, '__typename'),
    });

    setPageState((prevState) => {
      return {
        ...prevState,
        itemName: '',
        containers: newContainers,
      };
    });

    await addItemToViewState({
      variables: {
        input: {
          boardId,
          viewStateId: container.id,
          issueId: newIssue.id,
          columnPositionIndex: container.items.length,
        },
      },
    });

    setShowAddItemModal(false);
  };

  // This is called once we fetch data from server
  useEffect(() => {
    if (getProjectInfo.loading || !getProjectInfo?.data) return;

    const thisBoard = getProjectInfo?.data?.project?.boards?.find(
      (b: any) => b.id === boardId
    );

    if (!thisBoard?.viewState) return;

    // We want to omit __typename metafield from gql query results
    const incomingData = omitDeep(thisBoard.viewState, '__typename');
    const correctedBoardState = cloneDeep(incomingData);

    // const remoteDataChanged = !isEqual(incomingData, pageState?.containers);
    const remoteDataChanged = thisBoard.version > pageState.boardVersion;

    console.log({
      remoteDataChanged,
      boardVersion: thisBoard.version,
      pageStateBoardVersion: pageState.boardVersion,
    });

    if (remoteDataChanged) {
      setTimeout(() => {
        console.log('REMOTE DATA CHANGED');
        console.log({
          containers,
          incomingData,
        });
        setPageState((prevState) => {
          return {
            ...prevState,
            containers: incomingData,
            boardVersion: thisBoard.version,
          };
        });
      }, 1000);

      return;
    }

    // TODO: Testing if this is messing with the board
    if (!isEmpty(containers)) {
      console.log('EXITING EARLY');
      return;
    }

    let hasMismatchedIssueStatuses = false;

    // If the issue status of an issue does not match the container it is in, we need to move it to the correct container
    // this can happen when using the modal issue status dropdown to change the issue status versus dragging the issue to a new container
    incomingData.forEach((container: any) => {
      container.items.forEach((item: any) => {
        const issueData = getProjectInfo?.data?.project?.issues?.find(
          (issue: any) => issue.id === `${item.id}`.replace('item-', '')
        );

        if (issueData.status.id !== container.id.replace('container-', '')) {
          hasMismatchedIssueStatuses = true;

          // move to correct container
          const destinationContainer = findContainerById(
            `container-${issueData.status.id}`
          );

          const previousContainer = findContainerByItemId(
            `item-${issueData.id}`
          );

          if (!destinationContainer || !previousContainer) return;

          const destinationContainerIndex = containers.findIndex(
            (container) => container.id === destinationContainer.id
          );
          const previousContainerIndex = containers.findIndex(
            (container) => container.id === previousContainer.id
          );
          const issueStatusId = `${issueData.status.id}`;
          const issueId = `${issueData.id}`;
          const previousItemIndex = previousContainer.items.findIndex(
            (item) => item.id === `item-${issueData.id}`
          );
          const destinationItemIndex =
            destinationContainer.items.length > 0
              ? destinationContainer.items.length + 1
              : destinationContainer.items.length;

          // remove item from old container
          const [removedItem] = correctedBoardState[
            previousContainerIndex
          ].items.splice(previousItemIndex, 1);

          // push removed item to new container
          correctedBoardState[destinationContainerIndex].items.splice(
            destinationItemIndex,
            0,
            removedItem
          );
        }
      });
    });

    const projectHasArchivedIssues =
      getProjectInfo?.data?.project?.issues?.some(
        (issue: any) => issue.archived
      );

    if (isEmpty(containers) || remoteDataChanged) {
      setPageState((prevState) => {
        return {
          ...prevState,
          containers: incomingData,
        };
      });
    } else if (projectHasArchivedIssues) {
      // If the project has archived issues, we need to update the board
      // to remove the archived issues from the board
      setPageState((prevState) => {
        return {
          ...prevState,
        };
      });
    } else if (hasMismatchedIssueStatuses) {
      console.log({ correctedBoardState });
      // TODO: Look into if this is needed
      setPageState((prevState) => {
        return {
          ...prevState,
          // containers: correctedBoardState,
        };
      });
    }
  }, [getProjectInfo.data]);

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id)
      );
    }
  }

  const findItemById = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return null;
    const item = container.items.find((item) => item.id === id);
    if (!item) return null;
    return item;
  };

  const findContainerByItemId = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return null;
    return container;
  };

  const findContainerById = (id: UniqueIdentifier | undefined) => {
    const container = containers.find((container) => container.id === id);
    if (!container) return null;
    return container;
  };

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const item = findItemById(id);
    if (!item) return '';
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return '';
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return [];
    return container.items;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Enable sort function when dragging 10px   💡 here!!!
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setPageState((prevState) => {
      return {
        ...prevState,
        activeId: id,
      };
    });
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = cloneDeep(containers);
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );

        setPageState((prevState) => {
          return {
            ...prevState,
            containers: newItems,
          };
        });
      } else {
        // In different containers
        let newItems = cloneDeep(containers);
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setPageState((prevState) => {
          return {
            ...prevState,
            containers: newItems,
          };
        });
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = cloneDeep(containers);
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setPageState((prevState) => {
        return {
          ...prevState,
          containers: newItems,
        };
      });
    }
  };

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes('container') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      console.log('CONTAINER,CONTAINER');
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setPageState((prevState) => {
        return {
          ...prevState,
          containers: newItems,
        };
      });
      // console.log({ newItems, containers });
    }

    // Handling item moving to another container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id === over.id
    ) {
      // console.log('OTHER,CONTAINER');
      const destinationContainer = findContainerByItemId(over.id);
      if (!destinationContainer) return;

      const destinationIssueStatus =
        getProjectInfo.data.project.issueStatuses.find(
          (issueStatus: any) =>
            issueStatus.name.toLowerCase() ===
            destinationContainer.title.toLowerCase()
        );

      // TODO: Temporary until we decouple the issue status from the container
      const issueStatusId = destinationIssueStatus?.id;

      const issueId = `${active.id}`.replace('item-', '');

      // START
      const overContainer = findValueOfItems(over.id, 'item');
      if (!overContainer) return;

      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      let newItems = [...containers];

      newItems[overContainerIndex].items[overitemIndex].status = pick(
        destinationIssueStatus,
        ['id', 'name', 'projectId']
      );

      // setPageState((prevState) => {
      //   return {
      //     ...prevState,
      //     containers: newItems,
      //   };
      // });
      // END

      updateIssue({
        variables: {
          input: {
            issueStatusId,
            id: issueId,
          },
        },
        onCompleted: (data) => {
          const isIssueDone =
            data.updateIssue.status.name.toLowerCase() === 'done';
          const userEnabledCelebrateCompletedIssue = getMe?.data?.me?.settings
            ? JSON.parse(getMe.data.me.settings)?.celebrateCompletedIssue
            : true;

          if (isIssueDone && userEnabledCelebrateCompletedIssue) {
            conductor?.run({
              duration: 1000,
              speed: 2,
            });
          }

          // const viewStateId = newItems[overContainerIndex].id;
          // const issueId =
          //   `${newItems[overContainerIndex].items[overitemIndex].id}`.replace(
          //     'item-',
          //     ''
          //   );
          // const columnPositionIndex = overitemIndex;

          setPageState((prevState) => ({
            ...prevState,
            boardVersion: prevState.boardVersion + 1,
          }));

          return getProjectInfo.refetch();

          // return addItemToViewState({
          //   variables: {
          //     input: {
          //       boardId,
          //       viewStateId,
          //       issueId,
          //       columnPositionIndex,
          //     },
          //   },
          // }).catch((e) => {
          //   console.error('ERROR_ADDING_ITEM_TO_VIEW_STATE', { e });
          // });
        },
      });
    }

    // Handling item Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      console.log('ITEM,ITEM');
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
        setPageState((prevState) => {
          return {
            ...prevState,
            containers: newItems,
          };
        });
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setPageState((prevState) => {
          return {
            ...prevState,
            containers: newItems,
          };
        });
      }
    }

    // Handling item dropping into Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      console.log('ITEM,CONTAINER');
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );

      newItems[overContainerIndex].items.push(removeditem);
      setPageState((prevState) => {
        return {
          ...prevState,
          containers: newItems,
        };
      });

      addItemToViewState({
        variables: {
          input: {
            boardId,
            viewStateId: overContainer.id,
            issueId: `${removeditem.id}`.replace('item-', ''),
            columnPositionIndex: newItems[overContainerIndex].items.length,
          },
        },
      }).catch((e) => {
        console.error('ERROR_ADDING_ITEM_TO_VIEW_STATE', { e });
      });
    }

    setPageState((prevState) => {
      return {
        ...prevState,
        activeId: null,
      };
    });
  }

  return (
    <div className='mx-auto'>
      {/* Add Container Modal */}
      <Modal
        showModal={showAddContainerModal}
        setShowModal={setShowAddContainerModal}
      >
        <div className='flex w-full flex-col items-start gap-y-4'>
          <h1 className='text-3xl font-bold'>Add Container</h1>
          <Input
            type='text'
            placeholder='Container Title'
            name='containername'
            value={containerName}
            onChange={(e) => {
              setPageState((prevState) => {
                return {
                  ...prevState,
                  containerName: e.target.value,
                };
              });
            }}
          />
          <Button onClick={onAddContainer}>Add container</Button>
        </div>
      </Modal>
      {/* Add Item Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div
          className='flex w-full flex-col items-start gap-y-4'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAddItem();
            }
          }}
        >
          <h1 className='text-3xl font-bold'>Add Issue</h1>
          <Input
            autoFocus
            type='text'
            placeholder='Issue Title'
            name='itemname'
            value={itemName}
            onChange={(e) => {
              setPageState((prevState) => {
                return {
                  ...prevState,
                  itemName: e.target.value,
                };
              });
            }}
          />
          <Button onClick={onAddItem}>Add Item</Button>
        </div>
      </Modal>

      <Toolbar setShowAddContainerModal={setShowAddContainerModal} />

      <div className='mt-10'>
        <div className='flex flex-nowrap gap-2 overflow-auto'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <Container
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  issueIds={container.items.map((i) =>
                    `${i.id}`.replace('item-', '')
                  )}
                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setPageState((prevState) => {
                      return {
                        ...prevState,
                        currentContainerId: container.id,
                      };
                    });
                  }}
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className='flex flex-col items-start gap-y-4'>
                      {container.items.map((i) => (
                        <Items
                          title={i.title}
                          id={i.id}
                          key={i.id}
                          project={getProjectInfo?.data?.project}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes('item') && (
                <Items
                  id={activeId}
                  title={findItemTitle(activeId)}
                  project={getProjectInfo?.data?.project}
                />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes('container') && (
                <Container id={activeId} title={findContainerTitle(activeId)}>
                  {findContainerItems(activeId).map((i) => (
                    <Items
                      key={i.id}
                      title={i.title}
                      id={i.id}
                      project={getProjectInfo?.data?.project}
                    />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>

          <IssueModal open={isIssueModalOpen} setOpen={setIsIssueModalOpen}>
            <IssueModalContents
              projectKey={getProjectInfo.data?.project.key ?? ''}
              issueId={selectedIssueId as string}
              projectId={projectId}
              boardId={boardId}
            />
          </IssueModal>
        </div>
      </div>
      <Fireworks onInit={onInit} />
    </div>
  );
}

'use client';

import { useMutation, useQuery } from '@apollo/client';
import { omitDeep } from '@apollo/client/utilities';
// https://github.com/chetanverma16/dndkit-guide/tree/main/components
// This guy did a pretty good job!!!
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

import { Button } from '@/components/Button';
import IssueModal from '@/components/IssueModal';
import IssueModalContents from '@/components/IssueModal/IssueModalContents';
import Toolbar from '@/components/KanbanBoard/Toolbar';
import {
  CREATE_ISSUE_MUTATION,
  CREATE_ISSUE_STATUS_MUTATION,
  GET_PROJECT_INFO,
  ISSUE_FIELDS,
  UPDATE_BOARD_MUTATION,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import useWsAuthenticatedSocket from '@/hooks/useWsAuthenticatedSocket';
import { apolloClient } from '@/services/apollo-client';
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
  saveToBackend: boolean;
}

const getIssueFragment = (issueId: string) => {
  return apolloClient.readFragment({
    id: `Issue:${issueId}`,
    fragment: ISSUE_FIELDS,
  });
};

export default function KanbanBoard({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) {
  const searchParams = useSearchParams()!;
  const selectedIssueId = searchParams.get('selectedIssueId');

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
    saveToBackend: false,
  });

  const {
    containers,
    activeId,
    currentContainerId,
    containerName,
    itemName,
    saveToBackend,
  } = pageState;

  const [createIssue] = useMutation(CREATE_ISSUE_MUTATION);
  const [updateIssue] = useMutation(UPDATE_ISSUE_MUTATION);
  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);
  const [addIssueStatus] = useMutation(CREATE_ISSUE_STATUS_MUTATION);

  const getProjectInfo = useQuery(GET_PROJECT_INFO, {
    skip: !projectId,
    fetchPolicy: 'cache-first',
    variables: {
      input: { id: `${projectId}` },
    },
  });

  // const getBoardIssues = useQuery(GET_BOARD_ISSUES, {
  //   skip: !boardId,
  //   variables: {
  //     input: { id: `${boardId}` },
  //   },
  // });

  // On page load we open the modal if there is a query param for the issue
  useEffect(() => {
    if (selectedIssueId && !isIssueModalOpen) {
      setIsIssueModalOpen(true);
    } else if (!selectedIssueId && isIssueModalOpen) {
      setIsIssueModalOpen(false);
    }
  }, [selectedIssueId]);

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

    // @ts-ignore
    const issueStatusId = container.id.replace('container-', '');

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

    const newIssue = newIssueResp.data.createIssue;

    const session = await getSession();

    const notification = {
      type: 'notification',
      title: 'New issue Created',
      message: `Ticket title: ${itemName}`,
      topic: `user:${session?.user?.id}`,
      tags: ['white_check_mark', 'openpro.notificationDuration=3000'],
      click: `${getDomainName()}/projects/${projectId}/boards/${boardId}/?selectedIssueId=${
        newIssue.id
      }`,
    };

    sendJsonMessage(notification);
    // await notify(notification);

    const id = `item-${newIssue.id}`;
    container.items.push({
      id,
      title: itemName,
      status: omitDeep(newIssue.status, '__typename'),
    });

    setPageState((prevState) => {
      return {
        ...prevState,
        itemName: '',
        saveToBackend: true,
        containers: newContainers,
      };
    });

    setShowAddItemModal(false);
  };

  useEffect(() => {
    if (saveToBackend) {
      // const configuredContainerOrder = JSON.parse(
      //   getProjectInfo?.data?.project?.boards?.[0]?.containerOrder
      // ).map((item: any) => ({
      //   id: `container-${item.id}`,
      //   name: item.title,
      //   position: item.position,
      // }));

      // const currentContainerOrder = containers.map((item, index) => ({
      //   id: item.id,
      //   name: item.title,
      //   position: index,
      // }));

      // TODO: we got some work to do here on using the backend container order
      // if (isEqual(configuredContainerOrder, currentContainerOrder)) {
      //   console.log('No need to update the backend');
      // } else {
      //   console.log('Need to update the backend');
      // }

      const filteredContainers = containers.map((container) => {
        const items = container.items.reduce((acc, item) => {
          const issueData = getIssueFragment(`${item.id}`.replace('item-', ''));

          // We remove archived items from the board
          if (!issueData.archived) {
            acc.push(item);
          }

          return acc;
        }, [] as any[]);

        return {
          ...container,
          items,
        };
      });

      updateBoard({
        onCompleted: () => {
          setPageState((prevState) => {
            return {
              ...prevState,
              saveToBackend: false,
            };
          });
        },
        variables: {
          input: {
            id: boardId,
            viewState: filteredContainers,
          },
        },
      });
    }
  }, [saveToBackend, containers]);

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

    const remoteDataChanged = !isEqual(incomingData, pageState?.containers);
    let hasMismatchedIssueStatuses = false;

    // If the issue status of an issue does not match the container it is in, we need to move it to the correct container
    // this can happen when using the modal issue status dropdown to change the issue status versus dragging the issue to a new container
    incomingData.forEach((container: any) => {
      container.items.forEach((item: any) => {
        const issueData = getIssueFragment(`${item.id}`.replace('item-', ''));
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
          saveToBackend: true,
        };
      });
    } else if (hasMismatchedIssueStatuses) {
      console.log({ correctedBoardState });
      setPageState((prevState) => {
        return {
          ...prevState,
          containers: correctedBoardState,
          saveToBackend: true,
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
      const destinationContainer = findContainerByItemId(over.id);
      const issueStatusId = `${destinationContainer?.id}`.replace(
        'container-',
        ''
      );
      const issueId = `${active.id}`.replace('item-', '');

      updateIssue({
        variables: {
          input: {
            issueStatusId,
            id: issueId,
          },
        },
        onCompleted: (data) => {
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
            data.updateIssue.status,
            ['id', 'name', 'projectId']
          );

          setPageState((prevState) => {
            return {
              ...prevState,
              containers: newItems,
            };
          });
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
    }

    setPageState((prevState) => {
      return {
        ...prevState,
        activeId: null,
        saveToBackend: true,
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
    </div>
  );
}

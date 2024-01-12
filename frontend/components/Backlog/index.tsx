import { useMutation, useQuery } from '@apollo/client';
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
import { cloneDeep, flatMap, pullAt } from 'lodash';
import { getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import IssueModal from '@/components/IssueModal';
import IssueModalContents from '@/components/IssueModal/IssueModalContents';
import {
  CREATE_ISSUE_MUTATION,
  CREATE_ISSUE_STATUS_MUTATION,
  GET_PROJECT_INFO,
  UPDATE_BOARD_MUTATION,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
import useWsAuthenticatedSocket from '@/hooks/useWsAuthenticatedSocket';

import { Button } from './Button';
// Components
import Container from './Container';
import Input from './Input';
import Items from './Item';
import Modal from './Modal';

// TODO: When we drag from backlog into a board we need to push into the viewState

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    status: any;
  }[];
};

type BacklogState = {
  isIssueModalOpen: boolean;
  containers: DNDType[];
  activeId: UniqueIdentifier | null;
  currentContainerId: UniqueIdentifier | null;
  containerName: string;
  itemName: string;
  showAddContainerModal: boolean;
  showAddItemModal: boolean;
  saveToBackend: boolean;
};

export default function Backlog({ projectId }: { projectId: string }) {
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const selectedIssueId = params.get('selectedIssueId');

  const { sendJsonMessage } = useWsAuthenticatedSocket();

  const [backlogState, setBacklogState] = useState<BacklogState>({
    isIssueModalOpen: false,
    containers: [],
    activeId: null,
    currentContainerId: null,
    containerName: '',
    itemName: '',
    showAddContainerModal: false,
    showAddItemModal: false,
    saveToBackend: false,
  });

  const [createIssue, createIssueProps] = useMutation(CREATE_ISSUE_MUTATION);
  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);
  const [addIssueStatus] = useMutation(CREATE_ISSUE_STATUS_MUTATION);
  const getProjectInfo = useQuery(GET_PROJECT_INFO, {
    skip: !projectId,
    variables: { input: { id: `${projectId}` } },
  });

  // On page load we open the modal if there is a query param for the issue
  useEffect(() => {
    if (selectedIssueId && !backlogState.isIssueModalOpen) {
      setBacklogState({
        ...backlogState,
        isIssueModalOpen: true,
      });
    } else if (!selectedIssueId && backlogState.isIssueModalOpen) {
      setBacklogState({
        ...backlogState,
        isIssueModalOpen: false,
      });
    }
  }, [selectedIssueId]);

  const onAddContainer = async () => {
    if (!backlogState.containerName) return;

    const newIssueStatusResp = await addIssueStatus({
      variables: { input: { projectId, name: backlogState.containerName } },
    });

    const newIssueStatus = newIssueStatusResp.data.createIssueStatus;

    const id = `container-${newIssueStatus.id}`;

    setBacklogState((prevState) => ({
      ...prevState,
      containers: [
        ...prevState.containers,
        {
          id,
          title: backlogState.containerName,
          items: [],
        },
      ],
      containerName: '',
      showAddContainerModal: false,
    }));
  };

  const onAddItem = async () => {
    if (!backlogState.itemName) return;

    const container = backlogState.containers.find(
      (item) => item.id === backlogState.currentContainerId
    );
    if (!container) return;

    // @ts-ignore
    const issueStatusId = container.id.replace('container-', '');

    console.log({
      issueStatusId: getProjectInfo.data.project.issueStatuses[0].id,
    });

    // Create the item in backend
    const newIssueResp = await createIssue({
      variables: {
        input: {
          projectId: `${projectId}`,
          title: backlogState.itemName,
          description: '',
          issueStatusId: `${
            issueStatusId > 0
              ? issueStatusId
              : getProjectInfo.data.project.issueStatuses[0].id
          }`,
        },
      },
    });

    const newIssue = newIssueResp.data.createIssue;

    const session = await getSession();

    const notification = {
      type: 'notification',
      title: 'New issue Created',
      message: `Ticket title: ${backlogState.itemName}`,
      topic: `user:${session?.user?.id}`,
      tags: ['white_check_mark', 'openpro.notificationDuration=3000'],
    };

    sendJsonMessage(notification);

    // await notify(notification);

    const id = `item-${newIssue.id}`;
    container.items.push({
      id,
      title: backlogState.itemName,
      status: newIssue.status,
    });

    setBacklogState((prevState) => ({
      ...prevState,
      containers: [...prevState.containers],
      itemName: '',
      showAddItemModal: false,
      saveToBackend: true,
    }));
  };

  // This is called once we fetch data from server
  useEffect(() => {
    if (getProjectInfo.loading) return;

    if (!getProjectInfo?.data) return;

    const boards = getProjectInfo?.data?.project?.boards;

    let itemIdsInABoard: Set<string> = new Set();

    const buildContainers = boards.map((board: any) => {
      const boardState = board.viewState;

      const allItems = flatMap(boardState, 'items');

      allItems.forEach((item) => itemIdsInABoard.add(item.id));

      return {
        id: `container-${board.id}`,
        title: board.name ?? `Board: ${board.id}`,
        items: allItems,
      };
    });

    // This is the backlog section for items not in a board
    buildContainers.push({
      id: 'container-0',
      title: 'Backlog',
      items: getProjectInfo?.data?.project?.issues
        .filter((issue: any) => !itemIdsInABoard.has(`item-${issue.id}`))
        .map((issue: any) => ({
          id: `item-${issue.id}`,
          title: issue.title,
          status: issue.status,
          assignee: issue.assignee,
        })),
    });

    setBacklogState((prevState) => ({
      ...prevState,
      containers: buildContainers,
    }));
  }, [getProjectInfo.data]);

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return backlogState.containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return backlogState.containers.find((container) =>
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

    setBacklogState((prevState) => ({
      ...prevState,
      activeId: active.id,
    }));
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
      const activeContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = backlogState.containers.findIndex(
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
        let newItems = [...backlogState.containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );

        setBacklogState((prevState) => ({
          ...prevState,
          containers: newItems,
        }));
      } else {
        // In different containers
        let newItems = [...backlogState.containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setBacklogState((prevState) => ({
          ...prevState,
          containers: newItems,
        }));
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
      const activeContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = [...backlogState.containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setBacklogState((prevState) => ({
        ...prevState,
        containers: newItems,
      }));
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
      const activeContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...backlogState.containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);

      setBacklogState((prevState) => ({
        ...prevState,
        containers: newItems,
      }));
    }

    // Handling item moving to another container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id === over.id
    ) {
      console.log('ITEM2,ITEM2');
      const activeContainer = findValueOfItems(active.id, 'item');

      // @ts-ignore
      const boardId = activeContainer?.id.replace('container-', '');

      if (!boardId) return;

      const boards = getProjectInfo?.data?.project?.boards;

      // push from backlog onto the destination board
      if (boardId !== '0') {
        const boardState = boards.find((b: any) => b.id === boardId).viewState;

        if (!activeContainer) return;

        const activeContainerItem = activeContainer.items.find(
          (item: any) => item.id === active.id
        );

        if (!activeContainerItem) return;

        const boardStateDestinationIndex = boardState.findIndex(
          (item: any) => item.title === activeContainerItem.status.name
        );

        boardState[boardStateDestinationIndex].items.push(activeContainerItem);

        updateBoard({
          variables: {
            input: {
              id: boardId,
              viewState: boardState,
            },
          },
        });
      } else if (boardId === '0') {
        // push from board onto the backlog
        boards.forEach((board: any) => {
          const { viewState } = board;

          viewState.forEach((container: any) => {
            const item = container.items.find(
              (item: any) => item.id === active.id
            );

            if (item) {
              const indexOfContainer = viewState.findIndex(
                (c: any) => c.id === container.id
              );

              const indexOfItemInContainer = container.items.findIndex(
                (i: any) => i.id === active.id
              );

              const newViewState = cloneDeep(viewState);

              pullAt(
                newViewState[indexOfContainer].items,
                indexOfItemInContainer
              );

              return updateBoard({
                variables: {
                  input: {
                    id: board.id,
                    viewState: newViewState,
                  },
                },
              });
            }
          });
        });
      }
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
      const activeContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = backlogState.containers.findIndex(
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
        let newItems = [...backlogState.containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
        setBacklogState((prevState) => ({
          ...prevState,
          containers: newItems,
        }));
      } else {
        // In different containers
        let newItems = [...backlogState.containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setBacklogState((prevState) => ({
          ...prevState,
          containers: newItems,
        }));
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
      const activeContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = backlogState.containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...backlogState.containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );

      newItems[overContainerIndex].items.push(removeditem);
      setBacklogState((prevState) => ({
        ...prevState,
        containers: newItems,
      }));
    }

    setBacklogState((prevState) => ({
      ...prevState,
      saveToBackend: true,
      activeId: null,
    }));
  }

  return (
    <div className='mx-auto'>
      {/* Add Item Modal */}
      <Modal
        showModal={backlogState.showAddItemModal}
        setShowModal={(value: boolean) => {
          setBacklogState((prevState) => ({
            ...prevState,
            showAddItemModal: value,
          }));
        }}
      >
        <div className='flex w-full flex-col items-start gap-y-4'>
          <h1 className='text-3xl font-bold'>Add Item</h1>
          <Input
            type='text'
            placeholder='Item Title'
            name='itemname'
            value={backlogState.itemName}
            onChange={(e) =>
              setBacklogState({ ...backlogState, itemName: e.target.value })
            }
          />
          <Button onClick={onAddItem}>Add Item</Button>
        </div>
      </Modal>

      <div className='mt-10'>
        <div className='flex flex-col flex-nowrap gap-6'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={backlogState.containers.map((i) => i.id)}>
              {backlogState.containers.map((container) => (
                <Container
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  onAddItem={() => {
                    setBacklogState((prevState) => ({
                      ...prevState,
                      showAddItemModal: true,
                      currentContainerId: container.id,
                    }));
                  }}
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className='flex flex-col items-start gap-y-0.5'>
                      {container.items.map((i) => (
                        <Items
                          title={i.title}
                          id={i.id}
                          key={i.id}
                          status={i.status}
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
              {backlogState.activeId &&
                backlogState.activeId.toString().includes('item') && (
                  <Items
                    id={backlogState.activeId}
                    title={findItemTitle(backlogState.activeId)}
                    status={findItemById(backlogState.activeId)?.status}
                    project={getProjectInfo?.data?.project}
                  />
                )}
              {/* Drag Overlay For Container */}
              {backlogState.activeId &&
                backlogState.activeId.toString().includes('container') && (
                  <Container
                    id={backlogState.activeId}
                    title={findContainerTitle(backlogState.activeId)}
                  >
                    {findContainerItems(backlogState.activeId).map((i) => (
                      <Items
                        key={i.id}
                        title={i.title}
                        id={i.id}
                        status={i.status}
                        project={getProjectInfo?.data?.project}
                      />
                    ))}
                  </Container>
                )}
            </DragOverlay>
          </DndContext>

          <IssueModal
            open={backlogState.isIssueModalOpen}
            setOpen={(value) => {
              setBacklogState((prevState) => ({
                ...prevState,
                isIssueModalOpen: value,
              }));
            }}
          >
            <IssueModalContents
              projectKey={getProjectInfo.data?.project.key ?? ''}
              issueId={selectedIssueId as string}
              projectId={projectId}
            />
          </IssueModal>
        </div>
      </div>
    </div>
  );
}

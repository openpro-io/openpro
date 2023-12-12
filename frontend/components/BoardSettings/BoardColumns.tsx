import { SetStateAction, useEffect, useState } from 'react';
import { classNames } from '@/services/utils';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_BOARD_INFO,
  GET_PROJECT_INFO,
  UPDATE_BOARD_MUTATION,
} from '@/gql/gql-queries-mutations';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { arrayMove } from '@dnd-kit/sortable';

type ContainerItem = {
  id: string;
  title: string;
};

const BoardColumns = ({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) => {
  const [columns, setColumns] = useState<ContainerItem[]>([]);

  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);
  const getBoardInfo = useQuery(GET_BOARD_INFO, {
    skip: !boardId,
    variables: { input: { id: boardId } },
  });

  const getProjectInfo = useQuery(GET_PROJECT_INFO, {
    skip: !projectId,
    variables: { input: { id: projectId } },
  });

  useEffect(() => {
    console.log({ columns });
  }, [columns]);

  useEffect(() => {
    if (getBoardInfo?.data?.board?.containerOrder) {
      const buildContainers: SetStateAction<ContainerItem[]> = [];

      const containerOrder = JSON.parse(
        getBoardInfo?.data?.board?.containerOrder ?? '[]'
      );

      containerOrder.forEach((container: any) => {
        buildContainers[container.position] = {
          id: container.id,
          title: container.title,
        };
      });

      setColumns(buildContainers);
    } else if (getProjectInfo?.data) {
      const buildContainers = getProjectInfo?.data?.project.issueStatuses.map(
        (issueStatus: any) => {
          return {
            id: issueStatus.id,
            title: issueStatus.name,
          };
        }
      );

      setColumns(buildContainers);
    }
  }, [getProjectInfo?.data]);

  const handleSortOrder = async ({
    from,
    to,
  }: {
    from: number;
    to: number;
  }) => {
    const cols = [...columns];
    const newColumnOrder = arrayMove(cols, from, to);
    setColumns(newColumnOrder);

    await updateBoard({
      variables: {
        input: {
          id: boardId,
          containerOrder: JSON.stringify(
            newColumnOrder.map((column: any, index: number) => {
              return {
                id: column.id,
                position: index,
                title: column.title,
              };
            })
          ),
        },
      },
    });
  };

  const maxPosition = columns.length - 1;

  return (
    <div className='flex w-1/2 flex-col gap-y-1'>
      Column Order
      {columns.map((column: any, index: number) => {
        return (
          <div
            key={index}
            className='flex rounded border border-primary/20 p-1 shadow-sm'
          >
            <div className='flex-1'>
              {index} - {column.title}
            </div>
            <div className='flex'>
              <button
                className={classNames(
                  index === 0 && 'cursor-not-allowed opacity-50'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (index === 0) return;
                  handleSortOrder({ from: index, to: index - 1 });
                }}
              >
                <FaArrowUp />
              </button>{' '}
              <button
                className={classNames(
                  index === maxPosition && 'cursor-not-allowed opacity-50'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (index === maxPosition) return;
                  handleSortOrder({ from: index, to: index + 1 });
                }}
              >
                <FaArrowDown />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardColumns;

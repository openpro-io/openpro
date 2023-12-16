import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import { Button } from '../Button';
import { Button } from '@/components/Button';
import { classNames } from '@/services/utils';
import { BsArrowsMove } from 'react-icons/bs';
import { useMutation } from '@apollo/client';
import { UPDATE_ISSUE_MUTATION } from '@/gql/gql-queries-mutations';

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
  issueIds,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });
  const [updateIssue] = useMutation(UPDATE_ISSUE_MUTATION);

  const archiveIssues = async (issueIds?: string[]) => {
    if (!issueIds) return;

    const promises = issueIds.map((issueId) =>
      updateIssue({
        variables: {
          input: {
            id: issueId,
            archived: true,
          },
        },
      })
    );

    await Promise.all(promises);
  };

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={classNames(
        'flex h-full w-full min-w-72 flex-col gap-y-4 rounded-xl bg-kanban-column p-2',
        isDragging && 'opacity-50'
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-1'>
          <h1 className='text-xl'>{title}</h1>
          <p className='text-sm'>{description}</p>
        </div>
        <div>
          {title?.toLowerCase() === 'done' && (
            <button
              className='text-xs'
              onClick={() => {
                if (confirm('Are you sure you want to archive this column?')) {
                  archiveIssues(issueIds);
                }
              }}
            >
              Archive All
            </button>
          )}

          <button
            className='ml-3 rounded-xl border p-2 text-xs shadow-lg hover:shadow-xl'
            {...listeners}
          >
            <BsArrowsMove className='h-4 w-4' />
          </button>
        </div>
      </div>

      {children}
      <Button variant='transparent' onClick={onAddItem}>
        Add Issue
      </Button>
    </div>
  );
};

export default Container;

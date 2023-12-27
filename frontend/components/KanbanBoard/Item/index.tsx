import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React, { useCallback, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { classNames, formatUser } from '@/services/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useFragment } from '@apollo/client';
import { ISSUE_FIELDS } from '@/gql/gql-queries-mutations';
import Avatar from '@/components/Avatar';
import type { Route } from 'next';
import { RiTaskFill } from 'react-icons/ri';
import { priorityToIcon } from '@/components/Icons';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  project: any;
};

const Items = ({ id, title, project }: ItemsType) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const [isMouseDown, setIsMouseDown] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });

  const issueId = `${id}`.replace('item-', '');

  const { data: issueData } = useFragment({
    fragment: ISSUE_FIELDS,
    from: {
      __typename: 'Issue',
      id: issueId,
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const isFiltered = () => {
    if (searchParams.has('text')) {
      return !issueData?.title
        ?.toLowerCase()
        .includes(searchParams.get('text')?.toLowerCase() as string);
    }

    if (searchParams.has('tagIds')) {
      const tagIds = searchParams.get('tagIds')?.split(',');
      return !issueData?.tags?.some((tag: any) => tagIds?.includes(tag?.id));
    }

    if (searchParams.has('selectedUserId')) {
      return issueData?.assignee?.id !== searchParams.get('selectedUserId');
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={classNames(
        isFiltered() && 'hidden',
        'w-full cursor-pointer rounded-md border border-transparent bg-kanban-card px-2 py-2 shadow-md hover:border-primary/10',
        isDragging && 'opacity-50'
      )}
    >
      <Link
        href={
          `${pathname}?${createQueryString(
            'selectedIssueId',
            issueId
          )}` as Route
        }
      >
        <div className='space-y-2'>
          <div className='text-sm'>{issueData.title}</div>
          <div className='max-w-full'>
            {issueData?.tags && (
              <div className='flex flex-wrap gap-1'>
                {issueData?.tags?.map((tag: any) => (
                  <div
                    key={tag?.id}
                    className='rounded-md bg-neutral px-2 py-1 text-xs text-primary'
                  >
                    {tag?.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={classNames(
              issueData?.status?.name?.toLowerCase() === 'done'
                ? 'line-through'
                : '',
              `flex items-center justify-between`
            )}
          >
            <div className='flex h-6 items-center space-x-1'>
              <RiTaskFill className='h-4 w-4 rounded-sm text-blue-400' />
              <div className='text-sm font-semibold text-primary'>
                {project?.key?.toUpperCase()}-{issueId}
              </div>
            </div>

            <div className='col-span-1 col-start-12 flex space-x-1 justify-self-end'>
              {issueData?.priority !== 3 && (
                <div>{priorityToIcon(issueData?.priority)}</div>
              )}

              <div>
                <Avatar
                  person={formatUser(issueData?.assignee)}
                  className='h-6 w-6 align-middle'
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Items;

import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { classNames, formatUser } from '@/services/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Avatar from '@/components/Avatar';
import { useFragment } from '@apollo/client';
import { ISSUE_FIELDS } from '@/gql/gql-queries-mutations';
import type { Route } from 'next';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  status: any;
  project: any;
};

const Items = ({ id, title, status, project }: ItemsType) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // @ts-ignore
  const issueId = id.replace('item-', '');

  const { data } = useFragment({
    fragment: ISSUE_FIELDS,
    from: {
      __typename: 'Issue',
      id: issueId,
    },
  });

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

  const selectedIssuePath = () => {
    // @ts-ignore
    params.set('selectedIssueId', id.replace('item-', ''));
    return pathname + '?' + params.toString();
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
        'border-1 bg-kanban-card w-full rounded-md border px-2 py-2 shadow-sm hover:border-gray-200 hover:bg-gray-200 dark:hover:bg-slate-800',
        isDragging && 'opacity-50'
      )}
    >
      <Link href={selectedIssuePath() as Route}>
        <div className={classNames(`grid grid-cols-12`)}>
          <div className='col-span-5 flex flex-row space-x-2 pl-5'>
            <div
              className={classNames(
                status?.name?.toLowerCase() === 'done' ? 'line-through' : '',
                'w-20'
              )}
            >
              {project?.key?.toUpperCase()}-{issueId}
            </div>
            <div className=''>{title}</div>
          </div>

          <div className='col-span-1 col-start-11'>
            <span className='text-xs font-bold'>{status?.name}</span>
          </div>

          <div className='col-span-1 col-start-12 flex space-x-5 justify-self-end'>
            <div>
              <Avatar
                person={data?.assignee}
                className='h-5 w-5 align-middle'
              />
            </div>
            {/*<div>*/}
            {/*  <button*/}
            {/*    onMouseDown={(e) => {*/}
            {/*      setIsMouseDown(true);*/}
            {/*    }}*/}
            {/*    onMouseUp={(e) => {*/}
            {/*      setIsMouseDown(false);*/}
            {/*    }}*/}
            {/*    className={classNames(*/}
            {/*      !isMouseDown ? 'cursor-grabbing' : 'hover:cursor-grab',*/}
            {/*      'rounded-md border p-1 text-xs shadow-lg hover:shadow-xl'*/}
            {/*    )}*/}
            {/*    {...listeners}*/}
            {/*  >*/}
            {/*    <BsArrowsMove className='h-3 w-3' />*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Items;

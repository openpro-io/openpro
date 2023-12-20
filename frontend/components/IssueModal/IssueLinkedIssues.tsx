import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { priorityToIcon } from '@/components/Icons';

const IssueLinkedIssues = ({ issueId }: { issueId?: string }) => {
  // TODO: This is sample data we need to pull from backend
  // TODO: Restructure data to group by link type and then map over each group
  const blockedIssues = [
    {
      id: 1,
      key: 'ticket-1',
      subject: 'PLACEHOLDER: blocked ticket subject',
      priority: 3,
      assignee: 'test',
      status: 'in progress',
    },
    {
      id: 2,
      key: 'ticket-2',
      subject: 'PLACEHOLDER: next ticket name',
      priority: 5,
      assignee: 'test',
      status: 'done',
    },
  ];

  return (
    <>
      <div className='pb-5 text-2xl'>Linked Issues</div>
      {blockedIssues.map(({ id, key, subject, priority, status }) => (
        <div
          key={id}
          className='group flex overflow-hidden rounded border border-primary/10 bg-surface-overlay px-2 shadow-sm hover:cursor-pointer hover:bg-surface-overlay-hovered'
        >
          <div className='relative m-1 flex w-full items-center gap-x-1 p-1'>
            <div>
              <CheckIcon className='h-6 w-6 text-blue-500' />
            </div>
            <div className='text-link-active hover:underline'>
              {key}
            </div>
            <div className='ml-4 shrink grow basis-0'>
              <div className='flex'>
                <div className='grow hover:underline'>
                  {subject}
                </div>
              </div>
            </div>
            <div className='flex'>{priorityToIcon(priority)}</div>
            <div className='flex items-center justify-center rounded-md bg-blue-500 px-2 text-primary-inverted'>
              {status}
            </div>
            <div className='right-0 opacity-0 hover:cursor-pointer hover:rounded-md hover:bg-surface-overlay group-hover:opacity-100'>
              <XMarkIcon className='h-6 w-6' />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default IssueLinkedIssues;

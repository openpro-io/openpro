import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { priorityToIcon } from '@/components/Icons';
import { GET_ISSUE_QUERY } from '@/gql/gql-queries-mutations';
import { useQuery } from '@apollo/client';
import { groupBy, lowerCase, startCase } from 'lodash';
import { BsPlus } from 'react-icons/bs';
import { Issue } from '@/gql/__generated__/graphql';

type Links = {
  [key: string]: Issue[];
};

const IssueLinkedIssues = ({
  issueId,
  projectKey,
}: {
  issueId?: string;
  projectKey?: string;
}) => {
  const { data, error } = useQuery(GET_ISSUE_QUERY, {
    skip: !issueId,
    variables: { input: { id: issueId } },
  });

  if (error) {
    return <div>Error loading linked issues</div>;
  }

  const links: Links = data?.issue?.links
    ? groupBy(data.issue.links, 'linkType')
    : {};

  return (
    <>
      <div className='flex items-center justify-between align-middle'>
        <div className='text-2xl'>Linked Issues</div>
        <div className='rounded-md hover:cursor-pointer hover:bg-surface-overlay-hovered'>
          <BsPlus className='h-6 w-6' />
        </div>
      </div>
      {Object.keys(links).map((linkType) => (
        <div key={linkType}>
          <div className='pb-1 pt-2 text-lg opacity-80'>
            {startCase(lowerCase(linkType))}
          </div>
          {links[linkType].map(({ id, title, priority, status }) => (
            <div
              key={id}
              className='group flex overflow-hidden rounded border border-primary/10 bg-surface-overlay px-2 shadow-sm hover:cursor-pointer hover:bg-surface-overlay-hovered'
            >
              <div className='relative m-1 flex w-full items-center gap-x-1 p-1'>
                <div>
                  <CheckIcon className='h-6 w-6 text-blue-500' />
                </div>
                <div className='text-link-active hover:underline'>
                  {projectKey}-{id}
                </div>
                <div className='ml-4 shrink grow basis-0'>
                  <div className='flex'>
                    <div className='grow hover:underline'>{title}</div>
                  </div>
                </div>
                <div className='flex'>{priorityToIcon(Number(priority))}</div>
                <div className='flex items-center justify-center rounded-md bg-blue-500 px-2 text-primary-inverted'>
                  {status?.name}
                </div>
                <div className='right-0 opacity-0 hover:cursor-pointer hover:rounded-md hover:bg-surface-overlay group-hover:opacity-100'>
                  <XMarkIcon className='h-6 w-6' />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default IssueLinkedIssues;

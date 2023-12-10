'use client';

import React from 'react';
import { formatUser } from '@/services/utils';
import { useFragment } from '@apollo/client';
import { ISSUE_FIELDS } from '@/gql/gql-queries-mutations';
import { useSearchParams } from 'next/navigation';
import { DateTime } from 'luxon';
import IssueCommentEditorTipTap from '@/components/IssueModal/IssueCommentEditorTipTap';
import EditorRenderOnly from '@/components/Editor/EditorRenderOnly';
import Avatar from '@/components/Avatar';

const IssueComments = ({ issueId }: { issueId?: string }) => {
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const selectedIssueId = issueId ?? params.get('selectedIssueId');

  const getIssueFragment = useFragment({
    fragment: ISSUE_FIELDS,
    from: {
      __typename: 'Issue',
      id: `${selectedIssueId}`,
    },
  });

  return (
    <>
      <div className='pb-5 text-2xl'>Comments</div>
      <IssueCommentEditorTipTap issueId={selectedIssueId} />
      {getIssueFragment?.data?.comments
        ?.slice()
        ?.reverse()
        .map((comment: any) => {
          const reporter = formatUser(comment.reporter);

          return (
            <div className='pb-10' key={comment.id}>
              <div className='flex space-x-2 pb-2 pt-1'>
                <Avatar person={reporter} className='h-6 w-6' />
                <div className=''>{reporter.name}</div>
                <div className='pt-0.5 text-sm'>
                  {DateTime.fromMillis(Number(comment.createdAt)).toRelative()}
                </div>
              </div>
              <div className='max-h-60 overflow-y-auto'>
                <EditorRenderOnly content={JSON.parse(comment.comment)} />
              </div>
              <div className='flex space-x-1 pt-2 text-sm'>
                <div>
                  <a href='#' className='hover:text-blue-700'>
                    edit
                  </a>
                </div>
                <div>
                  {' '}
                  <a href='#' className='hover:text-red-700'>
                    delete
                  </a>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default IssueComments;

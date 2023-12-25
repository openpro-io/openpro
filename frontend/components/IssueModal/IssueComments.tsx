'use client';

import React from 'react';
import { formatUser } from '@/services/utils';
import { useFragment, useMutation } from '@apollo/client';
import {
  DELETE_ISSUE_COMMENT_MUTATION,
  GET_ISSUE_QUERY,
  ISSUE_FIELDS,
} from '@/gql/gql-queries-mutations';
import { useSearchParams } from 'next/navigation';
import { DateTime } from 'luxon';
import IssueCommentEditorTipTap from '@/components/IssueModal/IssueCommentEditorTipTap';
import EditorRenderOnly from '@/components/Editor/EditorRenderOnly';
import Avatar from '@/components/Avatar';

type DeleteComment = {
  commentId: string;
  issueId: string;
};

const IssueComments = ({ issueId }: { issueId?: string }) => {
  const [deleteIssueComment] = useMutation(DELETE_ISSUE_COMMENT_MUTATION);
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

  const handleDeleteIssueComment = ({ commentId, issueId }: DeleteComment) => {
    if (!issueId || !commentId) {
      return;
    }

    return deleteIssueComment({
      refetchQueries: [
        {
          query: GET_ISSUE_QUERY,
          variables: { input: { id: issueId } },
        },
      ],
      variables: {
        input: {
          id: commentId,
        },
      },
    });
  };

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
                  <button
                    onClick={() => {
                      if (!comment.id || !issueId) {
                        return;
                      }

                      handleDeleteIssueComment({
                        issueId,
                        commentId: comment.id,
                      });
                    }}
                    className='hover:text-red-700'
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default IssueComments;

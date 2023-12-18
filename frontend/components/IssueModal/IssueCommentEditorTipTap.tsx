'use client';
import React, { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ISSUE_COMMENT_MUTATION,
  GET_ME,
  ISSUE_COMMENT_FIELDS,
} from '@/gql/gql-queries-mutations';
// @ts-ignore
import { Button } from '@/components/Button';
import { useSearchParams } from 'next/navigation';
import Editor from '@/components/Editor';
import Avatar from '@/components/Avatar';
import { formatUserAvatarUrl } from '@/services/utils';

export const IssueCommentEditorTipTap = ({
  issueId,
}: {
  issueId?: string | null;
}) => {
  const [editorContent, setEditorContent] = React.useState(undefined);
  const [showEditor, setShowEditor] = React.useState(false);
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const selectedIssueId = issueId ?? params.get('selectedIssueId');

  const getMe = useQuery(GET_ME);

  const [createIssueComment] = useMutation(CREATE_ISSUE_COMMENT_MUTATION, {
    update(cache, { data: { createIssueComment } }) {
      cache.modify({
        id: cache.identify({
          __typename: 'Issue',
          id: createIssueComment.issueId,
        }),
        fields: {
          comments(existingComments = []) {
            const newCommentRef = cache.writeFragment({
              data: createIssueComment,
              fragment: ISSUE_COMMENT_FIELDS,
            });

            return [...existingComments, newCommentRef];
          },
        },
      });
    },
  });

  const onUpdateCallback = (data: any) => {
    setEditorContent(data);
  };

  // comment.0.comment is set because this currently is always a NEW comment which has no ID yet
  // TODO: lets adjust this to be more dynamic and adapt to the current comment ID
  return (
    <div className='flex gap-1 pb-10'>
      <Avatar person={getMe?.data?.me} className='h-8 w-8' />
      <div className='flex-1 flex-col'>
        {showEditor && (
          <Editor
            documentName={`comment.0.comment`}
            onUpdateCallback={onUpdateCallback}
          />
        )}
        {/* COMPONENT HERE */}
        {!showEditor && (
          <article
            onClick={() => setShowEditor(true)}
            className='prose prose-sm h-10 max-w-full overflow-y-scroll rounded-lg'
          >
            <div className='m-1 text-primary opacity-70'>
              Click to add comment...
            </div>
          </article>
        )}
        {showEditor && (
          <div className='pb-10'>
            <Button
              text='Cancel'
              variant='transparent'
              onClick={() => {
                if (!selectedIssueId) return;
                setShowEditor(false);
              }}
              classes='float-right mt-2 shadow-none hover:bg-gray-400 hover:bg-opacity-10'
            />

            <Button
              text='Save'
              onClick={() => {
                if (!selectedIssueId) return;

                createIssueComment({
                  variables: {
                    input: {
                      issueId: selectedIssueId,
                      comment: JSON.stringify(editorContent),
                    },
                  },
                }).then(() => {
                  setShowEditor(false);
                });
              }}
              classes='float-right mt-2'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCommentEditorTipTap;

'use client';

import { useFragment, useMutation } from '@apollo/client';
import { nanoid } from 'ai';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/Button';
import Editor from '@/components/Editor';
import {
  CREATE_ISSUE_COMMENT_MUTATION,
  DELETE_ISSUE_COMMENT_MUTATION,
  GET_ISSUE_QUERY,
  ISSUE_COMMENT_FIELDS,
  ISSUE_FIELDS,
  UPDATE_ISSUE_COMMENT_MUTATION,
} from '@/gql/gql-queries-mutations';

import IssueComment from './IssueComment';

type DeleteComment = {
  commentId: string;
};

type UpdateComment = {
  commentId: string;
  comment: string;
};

const IssueComments = ({ issueId }: { issueId?: string }) => {
  const [deleteIssueComment] = useMutation(DELETE_ISSUE_COMMENT_MUTATION);
  const [updateIssueComment] = useMutation(UPDATE_ISSUE_COMMENT_MUTATION);
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
  const [newDocumentName] = React.useState<string | undefined>(
    `issueComment.${nanoid()}.comment`
  );
  const [editorContent, setEditorContent] = React.useState(undefined);
  const [showEditor, setShowEditor] = React.useState(false);
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

  const onUpdateCallback = (data: any) => {
    setEditorContent(data);
  };

  const handleCreateIssueComment = () => {
    return createIssueComment({
      variables: {
        input: {
          issueId: selectedIssueId,
          comment: JSON.stringify(editorContent.content),
          commentRaw: Buffer.from(editorContent.state).toString('base64'),
        },
      },
    });
  };

  const handleDeleteIssueComment = ({ commentId }: DeleteComment) => {
    if (!commentId) {
      return;
    }

    return deleteIssueComment({
      refetchQueries: [
        {
          query: GET_ISSUE_QUERY,
          variables: { input: { id: selectedIssueId } },
        },
      ],
      variables: {
        input: {
          commentId,
        },
      },
    });
  };

  const handleUpdateIssueComment = ({ commentId, comment }: UpdateComment) => {
    if (!commentId) {
      return;
    }

    return updateIssueComment({
      refetchQueries: [
        {
          query: GET_ISSUE_QUERY,
          variables: { input: { id: selectedIssueId } },
        },
      ],
      variables: {
        input: {
          commentId,
          comment: JSON.stringify(comment),
        },
      },
    });
  };

  return (
    <>
      <div className='pb-5 text-2xl'>Comments</div>
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
        <>
          <Editor
            onUpdateCallback={onUpdateCallback}
            documentName={newDocumentName}
          />
          <div className='gap-x-1 pb-10'>
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

                handleCreateIssueComment().then(() => {
                  setShowEditor(false);
                });
              }}
              classes='float-right mt-2'
            />
          </div>
        </>
      )}
      {getIssueFragment?.data?.comments
        ?.slice()
        ?.reverse()
        .map((comment: any) => (
          <IssueComment
            handleDeleteIssueComment={handleDeleteIssueComment}
            handleUpdateIssueComment={handleUpdateIssueComment}
            key={comment.id}
            issueId={selectedIssueId!}
            comment={comment}
          />
        ))}
    </>
  );
};

export default IssueComments;

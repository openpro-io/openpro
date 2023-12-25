'use client';

import React from 'react';
import { useFragment, useMutation } from '@apollo/client';
import {
  DELETE_ISSUE_COMMENT_MUTATION,
  GET_ISSUE_QUERY,
  ISSUE_FIELDS,
  UPDATE_ISSUE_COMMENT_MUTATION,
} from '@/gql/gql-queries-mutations';
import { useSearchParams } from 'next/navigation';
import IssueCommentEditorTipTap from '@/components/IssueModal/IssueCommentEditorTipTap';
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
      <IssueCommentEditorTipTap issueId={selectedIssueId} />
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

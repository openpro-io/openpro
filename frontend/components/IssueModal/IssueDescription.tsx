'use client';
import React, { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ISSUE_QUERY,
  UPDATE_ISSUE_MUTATION,
} from '@/gql/gql-queries-mutations';
// @ts-ignore
import { Button } from '@/components/Button';
import { useSearchParams } from 'next/navigation';
import Editor from '@/components/Editor';
import EditorRenderOnly from '@/components/Editor/EditorRenderOnly';

export const IssueDescription = ({ issueId }: { issueId?: string }) => {
  const searchParams = useSearchParams()!;
  const selectedIssueId = issueId ?? searchParams.get('selectedIssueId');

  const [editorContent, setEditorContent] = React.useState(undefined);
  const [showEditor, setShowEditor] = React.useState(false);

  const { data: issueData } = useQuery(GET_ISSUE_QUERY, {
    skip: !issueId,
    variables: { input: { id: `${issueId}` } },
  });
  const [updateDescription] = useMutation(UPDATE_ISSUE_MUTATION);
  const defaultContent = issueData?.issue?.description
    ? JSON.parse(issueData?.issue?.description)
    : undefined;

  // const [uploadAsset] = useMutation(UPLOAD_ASSET_MUTATION);
  // const [createIssueComment] = useMutation(CREATE_ISSUE_COMMENT_MUTATION, {
  //   update(cache, { data: { createIssueComment } }) {
  //     cache.modify({
  //       id: cache.identify({
  //         __typename: 'Issue',
  //         id: createIssueComment.issueId,
  //       }),
  //       fields: {
  //         comments(existingComments = []) {
  //           const newCommentRef = cache.writeFragment({
  //             data: createIssueComment,
  //             fragment: ISSUE_COMMENT_FIELDS,
  //           });
  //
  //           return [...existingComments, newCommentRef];
  //         },
  //       },
  //     });
  //   },
  // });

  const onUpdateCallback = (data: any) => {
    setEditorContent(data);
  };

  return (
    <div className='pb-10 pt-10'>
      <div className='pb-5 text-2xl'>Description</div>
      {!showEditor && (
        <div onClick={() => setShowEditor(true)}>
          {!defaultContent && (
            <div className='m-1 opacity-70'>Click to add description...</div>
          )}
          {defaultContent && (
            <EditorRenderOnly
              content={defaultContent}
              className='border-none'
            />
          )}
        </div>
      )}

      {showEditor && (
        <>
          <Editor
            onUpdateCallback={onUpdateCallback}
            defaultContent={defaultContent}
            documentName={`issue.${selectedIssueId}.description`}
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

                console.log({ editorContent, selectedIssueId });
                updateDescription({
                  variables: {
                    input: {
                      id: selectedIssueId,
                      description: JSON.stringify(editorContent),
                    },
                  },
                }).then(() => {
                  setShowEditor(false);
                });
              }}
              classes='float-right mt-2'
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IssueDescription;

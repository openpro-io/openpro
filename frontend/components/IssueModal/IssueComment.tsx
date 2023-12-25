'use client';

import React from 'react';
import { formatUser } from '@/services/utils';
import { DateTime } from 'luxon';
import EditorRenderOnly from '@/components/Editor/EditorRenderOnly';
import Avatar from '@/components/Avatar';
import Editor from '@/components/Editor';
import { Button } from '@/components/Button';

const IssueComment = ({
  comment,
  handleDeleteIssueComment,
  handleUpdateIssueComment,
}: {
  comment: any;
  handleDeleteIssueComment: ({ commentId }: { commentId: string }) => void;
  handleUpdateIssueComment: ({
    commentId,
    comment,
  }: {
    comment: string;
    commentId: string;
  }) => Promise<any>;
}) => {
  const [editorContent, setEditorContent] = React.useState(undefined);
  const [showEditor, setShowEditor] = React.useState(false);

  const onUpdateCallback = (data: any) => {
    setEditorContent(data);
  };

  const reporter = formatUser(comment.reporter);
  const content = JSON.parse(comment.comment);
  const selectedCommentId = comment.id;

  return (
    <>
      <div className='pb-10' key={selectedCommentId}>
        <div className='flex space-x-2 pb-2 pt-1'>
          <Avatar person={reporter} className='h-6 w-6' />
          <div className=''>{reporter.name}</div>
          <div className='pt-0.5 text-sm'>
            {DateTime.fromMillis(Number(comment.createdAt)).toRelative()}
          </div>
        </div>
        {!showEditor && (
          <div onClick={() => setShowEditor(true)}>
            <EditorRenderOnly content={content} className='border-none' />
          </div>
        )}

        {showEditor && (
          <>
            <Editor
              onUpdateCallback={onUpdateCallback}
              defaultContent={content}
              documentName={`issueComment.${selectedCommentId}.comment`}
            />
            <div className='gap-x-1 pb-10'>
              <Button
                text='Cancel'
                variant='transparent'
                onClick={() => {
                  if (!selectedCommentId) return;
                  setShowEditor(false);
                }}
                classes='float-right mt-2 shadow-none hover:bg-gray-400 hover:bg-opacity-10'
              />

              <Button
                text='Save'
                onClick={() =>
                  handleUpdateIssueComment({
                    comment: editorContent ?? content,
                    commentId: selectedCommentId,
                  }).then(() => {
                    setShowEditor(false);
                  })
                }
                classes='float-right mt-2'
              />
            </div>
          </>
        )}
        <div className='flex space-x-1 pt-2 text-sm'>
          <div>
            {' '}
            <button
              onClick={() => {
                if (!selectedCommentId) {
                  return;
                }

                handleDeleteIssueComment({
                  commentId: selectedCommentId,
                });
              }}
              className='hover:text-red-700'
            >
              delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueComment;

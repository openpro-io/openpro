'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CoreEditorExtensions } from '@/components/Editor/extensions';
import { findTableAncestor } from '@/components/Editor/utils';
import { startImageUpload } from '@/components/Editor/plugins/upload-image';
import { ImageResizer } from '@/components/Editor/extensions/image/image-resize';
import { useMutation } from '@apollo/client';
import { UPLOAD_ASSET_MUTATION } from '@/gql/gql-queries-mutations';
import { EditorToolbar } from '@/components/Editor/toolbar';
import { NEXT_PUBLIC_API_URL, PUBLIC_NEXTAUTH_URL } from '@/services/config';
import { HocuspocusProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getUserColor } from '@/services/utils';
import { classNames } from '@/services/utils';
import axios from 'axios';
export * as EditorRenderOnly from './EditorRenderOnly';

const getToken = async () => {
  const { data } = await axios.get(`${PUBLIC_NEXTAUTH_URL}/api/get-jwt`);

  return data.token;
};

const Editor = ({
  onUpdateCallback,
  defaultContent,
  documentName,
}: {
  onUpdateCallback: (data: any) => void;
  defaultContent?: string;
  documentName?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [shouldShowAlert, setShouldShowAlert] = useState(false);
  const [uploadAsset] = useMutation(UPLOAD_ASSET_MUTATION);
  const [connected, setConnected] = useState(false);
  const { data: userSession } = useSession();
  // TODO: We want the issue ID for doc name. We may refactor this later
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const selectedIssueId = params.get('selectedIssueId');

  const saveToServer = async (file: File) => {
    const fileExtension = file.type.split('/')[1];

    try {
      const upload = await uploadAsset({
        variables: {
          input: {
            assetExtension: fileExtension,
            file,
          },
        },
      });

      return {
        remoteUrl: `${NEXT_PUBLIC_API_URL}/${upload.data.uploadAsset.assetPath}`,
        ...upload.data.uploadAsset,
      };
    } catch (e) {
      console.error({ e });
      throw new Error('Image upload failed');
    }
  };

  const deleteFile = async () => {};
  const uploadFile = async (file: File) => {
    console.log('upload file', file);
    return (await saveToServer(file)).remoteUrl;
    // TESTING
    // throw new Error('failed');
    // return 'https://picsum.photos/200/300?random=1';
  };

  const cancelUploadImage = () => {
    // TODO: this is broken
    // self?.commands.deleteCurrentNode();
    console.log('CANCEL IMAGE UPLOAD');
  };

  // Set up the Hocuspocus WebSocket provider
  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: `${
        new URL(`${NEXT_PUBLIC_API_URL}`).protocol.includes('https')
          ? 'wss'
          : 'ws'
      }://${new URL(`${NEXT_PUBLIC_API_URL}`).host}/collaboration`,
      name: documentName ?? 'default-document',
      // document: new Y.Doc(),
      token: getToken,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onStatus: (status) => {
        if (['connecting', 'connected'].includes(status.status)) {
          setConnected(true);
        }
        if (status.status === 'disconnected') setConnected(false);
      },
    });
  }, [documentName]);

  useEffect(() => {
    // Remove the provider on component unmount
    return () => {
      provider.destroy();
    };
  }, []);

  const editor = useEditor({
    extensions: [
      ...CoreEditorExtensions(deleteFile, cancelUploadImage),
      Collaboration.configure({
        document: provider.document,
      }),
      // Register the collaboration cursor extension
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userSession?.user?.name,
          color: getUserColor(`${userSession?.user?.id}`, 'hex'),
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      if (onUpdateCallback) onUpdateCallback(editor.getJSON());

      // for instant feedback loop
      setIsSubmitting?.('submitting');
      setShouldShowAlert?.(true);
      // onChange?.(editor.getJSON(), getTrimmedHTML(editor.getHTML()));
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
      },
      handlePaste: (view, event) => {
        if (typeof window !== 'undefined') {
          const selection: any = window?.getSelection();
          if (selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0);
            if (findTableAncestor(range.startContainer)) {
              return;
            }
          }
        }
        if (
          event.clipboardData &&
          event.clipboardData.files &&
          event.clipboardData.files[0]
        ) {
          event.preventDefault();
          const file = event.clipboardData.files[0];
          const pos = view.state.selection.from;
          startImageUpload(file, view, pos, uploadFile, setIsSubmitting);
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (typeof window !== 'undefined') {
          const selection: any = window?.getSelection();
          if (selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0);
            if (findTableAncestor(range.startContainer)) {
              return;
            }
          }
        }
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (coordinates) {
            startImageUpload(
              file,
              view,
              coordinates.pos - 1,
              uploadFile,
              setIsSubmitting
            );
          }
          return true;
        }
        return false;
      },

      attributes: {
        class:
          'prose min-w-full dark:prose-invert !focus:ring-0 prose-sm p-3 !focus:outline-none border border-primary/20 rounded-b-lg',
      },
    },
    // content: defaultContent ?? '',
  });

  return (
    <div>
      <section className='flex h-14 flex-wrap items-center border-l border-r border-t border-primary/20 bg-editor-toolbar pb-2 pl-5 pr-2 pt-2'>
        <EditorToolbar
          editor={editor}
          uploadFile={uploadFile}
          setIsSubmitting={setIsSubmitting}
        />
      </section>
      <EditorContent editor={editor}>
        {editor?.isActive('image') && editor?.isEditable && (
          <ImageResizer editor={editor} />
        )}
      </EditorContent>
      <div className='flex justify-between pb-1 pt-1 text-sm'>
        <div>
          <span
            className={classNames(
              connected ? 'text-green-500' : 'test-red-500',
              'ml-1 mr-1'
            )}
          >
            ●
          </span>
          {connected && editor
            ? `${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1 ? '' : 's'
              } viewing this document`
            : 'offline'}
        </div>
        <div>{userSession?.user?.name}</div>
      </div>
    </div>
  );
};

export default Editor;

import React from 'react';
import { Editor as TipTapEditorType } from '@tiptap/react';
import { UploadImage } from '@/components/Editor/types/upload-image';
import { startImageUpload } from '@/components/Editor/plugins/upload-image';
import { EditorMenuItem } from '@/components/Editor/types/editor-menu-item';
import {
  LuBold as IconBold,
  LuCheckSquare as IconTaskList,
  LuCode as IconCode,
  LuHeading1 as IconHeading1,
  LuHeading2 as IconHeading2,
  LuHeading3 as IconHeading3,
  LuImage as IconImage,
  LuItalic as IconItalic,
  LuList as IconList,
  LuListOrdered as IconListOrdered,
  LuQuote as IconBlockquote,
  LuRedo2 as IconRedo,
  LuPilcrow as IconParagraph,
  LuUndo2 as IconUndo,
  LuUnderline as IconUnderline,
  LuStrikethrough as IconStrikethrough,
} from 'react-icons/lu';
import { classNames } from '@/services/utils';

const insertImageCommand = (
  editor: TipTapEditorType,
  uploadFile: UploadImage,
  setIsSubmitting?: (
    isSubmitting: 'submitting' | 'submitted' | 'saved'
  ) => void,
  range?: Range
) => {
  // @ts-ignore
  if (range) editor.chain().focus().deleteRange(range).run();
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    if (input.files?.length) {
      const file = input.files[0];
      const pos = editor.view.state.selection.from;
      startImageUpload(file, editor.view, pos, uploadFile, setIsSubmitting);
    }
  };
  input.click();
};

const ImageItem = (
  editor: TipTapEditorType,
  uploadFile: UploadImage,
  setIsSubmitting?: (isSubmitting: 'submitting' | 'submitted' | 'saved') => void
): EditorMenuItem => ({
  name: 'image',
  isActive: () => editor?.isActive('image'),
  command: () => insertImageCommand(editor, uploadFile, setIsSubmitting),
  icon: IconImage,
});

const toggleTaskList = (editor: TipTapEditorType, range?: Range) => {
  // @ts-ignore
  if (range) editor?.chain().focus().deleteRange(range).toggleTaskList().run();
  else editor?.chain().focus().toggleTaskList().run();
};

const TaskListItem = (editor: TipTapEditorType): EditorMenuItem => ({
  name: 'To-do List',
  isActive: () => editor?.isActive('taskItem'),
  command: () => toggleTaskList(editor),
  icon: IconTaskList,
});

export const EditorToolbar = ({
  editor,
  uploadFile,
  setIsSubmitting,
}: {
  editor: any;
  uploadFile: UploadImage;
  setIsSubmitting?: any;
}) => {
  const uploadImageItem = ImageItem(editor, uploadFile, setIsSubmitting);
  const taskListItem = TaskListItem(editor);
  const buttonActiveClass = 'rounded bg-editor-toolbar-pressed bg-opacity-40';
  const buttonDisabledClass = 'text-gray-400 cursor-not-allowed';
  const seperatorClass =
    'bg-gray-300 w-px h-8 inline-block mx-2 select-none mx-2';
  const baseClass =
    'p-0 h-10 w-10 items-center justify-center flex hover:bg-editor-toolbar-pressed hover:bg-opacity-40 hover:rounded';

  return (
    <>
      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor?.can().chain().focus().toggleBold().run()}
        className={classNames(
          editor?.isActive('bold') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconBold title='Bold' />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor?.can().chain().focus().toggleItalic().run()}
        className={classNames(
          editor?.isActive('italic') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconItalic title='Italic' />
      </button>
      <div className={seperatorClass} />
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={classNames(
          editor?.isActive('heading', { level: 1 }) ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconHeading1 title='Heading 1' />
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={classNames(
          editor?.isActive('heading', { level: 2 }) ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconHeading2 title='Heading 2' />
      </button>
      <button
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={classNames(
          editor?.isActive('heading', { level: 3 }) ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconHeading3 title='Heading 3' />
      </button>
      <button
        onClick={() => editor?.chain().focus().setParagraph().run()}
        className={classNames(
          editor?.isActive('paragraph') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconParagraph title='Paragraph' />
      </button>

      <div className={seperatorClass} />

      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={classNames(
          editor?.isActive('bulletList') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconList title='Bullet List' />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={classNames(
          editor?.isActive('orderedList') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconListOrdered title='Ordered List' />
      </button>

      <div className={seperatorClass} />

      <button
        onClick={() => taskListItem.command()}
        className={classNames(
          taskListItem.isActive() ? buttonActiveClass : '',
          baseClass
        )}
      >
        {taskListItem.icon({})}
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        className={classNames(
          editor?.isActive('codeBlock') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconCode title='Code' />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        className={classNames(
          editor?.isActive('blockquote') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconBlockquote title='Blockquote' />
      </button>
      <button
        onClick={() => uploadImageItem.command()}
        className={classNames(
          uploadImageItem.isActive() ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconImage title='Upload Image' />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor?.can().chain().focus().toggleStrike().run()}
        className={classNames(
          editor?.isActive('strike') ? buttonActiveClass : '',
          baseClass
        )}
      >
        <IconStrikethrough title='Strikethrough' />
      </button>

      <div className={seperatorClass} />

      <button
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor?.can().chain().focus().undo().run()}
        className={classNames(
          !editor?.can().chain().focus().undo().run()
            ? buttonDisabledClass
            : '',
          baseClass
        )}
      >
        <IconUndo title='Undo' />
      </button>
      <button
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor?.can().chain().focus().redo().run()}
        className={classNames(
          !editor?.can().chain().focus().redo().run()
            ? buttonDisabledClass
            : '',
          baseClass
        )}
      >
        <IconRedo title='Redo' />
      </button>
    </>
  );
};

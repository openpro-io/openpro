import { EditorContent, useEditor } from '@tiptap/react';
import { CoreEditorExtensions } from '@/components/Editor/extensions';
import { classNames } from '@/services/utils';

const EditorRenderOnly = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  const editor = useEditor({
    editable: false,
    content,
    extensions: [...CoreEditorExtensions(async () => {})],
    editorProps: {
      attributes: {
        class: classNames(
          'prose min-w-full dark:prose-invert !focus:ring-0 prose-sm p-3 !focus:outline-none border-primary/20 rounded-b-lg hover:bg-gray-100',
          className
        ),
      },
    },
  });

  return <EditorContent editor={editor} />;
};

export default EditorRenderOnly;

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import Gapcursor from '@tiptap/extension-gapcursor';
import TiptapLink from '@tiptap/extension-link';
import { Mention } from '@tiptap/extension-mention';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import TiptapUnderline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
// import ts from 'highlight.js/lib/languages/typescript';
// import js from 'highlight.js/lib/languages/javascript';
// TODO: we use this theme
// import 'highlight.js/styles/tokyo-night-dark.css';
import 'highlight.js/styles/atom-one-dark.css';
// Load all highlight.js supported languages
import { common, createLowlight } from 'lowlight';
// @ts-ignore
import { Markdown } from 'tiptap-markdown';

import { DeleteImage } from '../types/delete-image';
import { isValidHttpUrl } from '../utils';
import { ColorHighlighter } from './color-highlighter';
import ImageExtension from './image';
import { SmilieReplacer } from './smile-replacer';
import suggestion from './suggestion';

const lowlight = createLowlight(common);

export const CoreEditorExtensions = (
  deleteFile: DeleteImage,
  cancelUploadImage?: () => any
) => [
  StarterKit.configure({
    history: false,
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-outside leading-3 -mt-2',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-outside leading-3 -mt-2',
      },
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal -mb-2',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-custom-border-300',
      },
    },
    code: {
      HTMLAttributes: {
        class:
          'rounded-md bg-custom-primary-30 mx-1 px-1 py-1 font-mono font-medium text-custom-text-1000',
        spellcheck: 'false',
      },
    },
    codeBlock: false,
    horizontalRule: false,
    dropcursor: {
      color: 'rgba(var(--color-text-100))',
      width: 2,
    },
    gapcursor: false,
  }),
  Gapcursor,
  TiptapLink.configure({
    protocols: ['http', 'https'],
    validate: (url) => isValidHttpUrl(url),
    HTMLAttributes: {
      class:
        'text-custom-primary-300 underline underline-offset-[3px] hover:text-custom-primary-500 transition-colors cursor-pointer',
    },
  }),
  ImageExtension(deleteFile, cancelUploadImage).configure({
    HTMLAttributes: {
      class: 'rounded-lg border border-custom-border-300',
    },
  }),
  TiptapUnderline,
  TextStyle,
  Color,
  TaskList.configure({
    HTMLAttributes: {
      class: 'not-prose pl-2',
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: 'flex items-start my-4',
    },
    nested: true,
  }),
  Markdown.configure({
    html: true,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Typography,
  ColorHighlighter,
  SmilieReplacer,
  Mention.configure({
    renderLabel({ options, node }) {
      return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
    },
    HTMLAttributes: {
      class:
        'border border-primary rounded-md box-decoration-clone px-1 py-0.5 bg-surface-overlay-hovered',
    },
    suggestion,
  }),
];

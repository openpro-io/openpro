import React from 'react';
import { Toaster, ToastIcon, resolveValue, toast } from 'react-hot-toast';
import Emoji, { toArray } from 'react-emoji-render';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

// TODO: We have a lot of re-renders here...
const ToastBody = ({
  toastMessage,
  t,
}: {
  toastMessage: string | null;
  t: any;
}) => {
  const router = useRouter();

  if (!toastMessage) return null;

  const { title, message, priority, tags, click } = JSON.parse(toastMessage);
  // console.log({ toastMessage });

  if (tags) {
    // We make the array of strings with :<var>: so it's ready for the emoji parser
    const parseTags = toArray(tags.map((tag: string) => `:${tag}:`).join(' '));

    if (
      // @ts-ignore
      parseTags.filter((tag: string | Symbol) => typeof tag === 'string')
        .length > 0
    ) {
      // TODO: lets prefix with tags in the message area if there is tags without emojis
      console.log('We have some tags that do not have emojis in them');
    }
  }

  return (
    <div className='flex w-full flex-col items-center space-y-4 bg-surface-overlay sm:items-end'>
      <div className='pointer-events-auto w-full max-w-sm overflow-hidden'>
        <div className='p-2'>
          <div className='flex'>
            <Link className='flex w-full items-start' href={click ?? {}}>
              <ToastIcon toast={t} />
              <div className='ml-3 w-fit flex-1 pt-0.5'>
                <p className='text-sm font-medium text-primary'>
                  {tags[0] && <Emoji>:{tags[0]}: </Emoji>}
                  {title || message}
                </p>
                <p className='mt-1 text-sm text-primary/70'>
                  {tags.length > 1 && (
                    <div>
                      Tags:{' '}
                      {tags.slice(1).map((tag: string, index: number) => (
                        <Emoji key={index}>:{tag}: </Emoji>
                      ))}{' '}
                    </div>
                  )}
                  {!title || message}
                </p>
              </div>
            </Link>
            <div className='ml-4 flex flex-shrink-0'>
              <button
                type='button'
                className='inline-flex rounded-md bg-transparent text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                <span className='sr-only'>Close</span>
                <XMarkIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Alert = () => {
  return (
    <Toaster position='top-right'>
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className='flex w-96 transform rounded-2xl border-primary bg-surface-overlay p-4 shadow-lg ring-1 ring-black ring-opacity-10'
          enter='transition-all duration-150'
          enterFrom='opacity-0 scale-50'
          enterTo='opacity-100 scale-100'
          leave='transition-all duration-150'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-75'
        >
          <ToastBody toastMessage={`${resolveValue(t.message, t)}`} t={t} />
        </Transition>
      )}
    </Toaster>
  );
};

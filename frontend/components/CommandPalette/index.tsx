import { Fragment, useEffect, useState } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  DocumentPlusIcon,
  FolderPlusIcon,
  FolderIcon,
  HashtagIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/services/utils';
import { useRouter } from 'next/navigation';

const projects = [
  { id: 1, name: 'Workflow Inc. / Website Redesign', url: '#' },
  // More projects...
];
const recent = [projects[0]];
export const quickActions = [
  {
    id: 'newFile',
    name: 'Add new file...',
    icon: DocumentPlusIcon,
    shortcut: 'N',
    url: '#',
  },
  {
    id: 'newProject',
    name: 'Add new project...',
    icon: DocumentPlusIcon,
    shortcut: 'NP',
    url: '/dashboard',
  },
  {
    id: 'newFolder',
    name: 'Add new folder...',
    icon: FolderPlusIcon,
    shortcut: 'F',
    url: '#',
  },
  {
    id: 'addHashtag',
    name: 'Add hashtag...',
    icon: HashtagIcon,
    shortcut: 'H',
    url: '#',
  },
  {
    id: 'addLabel',
    name: 'Add label...',
    icon: TagIcon,
    shortcut: 'L',
    url: '#',
  },
];

export const CommandPalette = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.key === 'k' && event.metaKey) || event.ctrlKey) {
        setOpen(!open);
      }
    }
    window.addEventListener('keydown', onKeyDown);

    // umount call
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const filteredProjects =
    query === ''
      ? []
      : projects.filter((project) => {
          return project.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery('')}
      appear
    >
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-surface-overlay shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'>
              <Combobox
                onChange={(item: any) => {
                  setOpen(false);
                  // TODO: if url is external, open in new tab
                  router.push(item.url);
                  // window.location = item.url;
                }}
              >
                <div className='relative'>
                  <MagnifyingGlassIcon
                    className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-primary'
                    aria-hidden='true'
                  />
                  <Combobox.Input
                    className='h-12 w-full border-0 bg-transparent pl-11 pr-4 text-primary placeholder:text-gray-400 focus:ring-0 sm:text-sm'
                    placeholder='Search...'
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {(query === '' || filteredProjects.length > 0) && (
                  <Combobox.Options
                    static
                    className='max-h-80 scroll-py-2 divide-y divide-gray-100 overflow-y-auto'
                  >
                    <li className='p-2'>
                      {query === '' && (
                        <h2 className='mb-2 mt-4 px-3 text-xs font-semibold text-primary'>
                          Recent searches
                        </h2>
                      )}
                      <ul className='text-sm text-primary'>
                        {(query === '' ? recent : filteredProjects).map(
                          (project) => (
                            <Combobox.Option
                              key={project.id}
                              value={project}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                  active && 'bg-indigo-600 text-primary'
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <FolderIcon
                                    className={classNames(
                                      'h-6 w-6 flex-none',
                                      active
                                        ? 'text-primary-inverted dark:text-primary'
                                        : 'text-primary'
                                    )}
                                    aria-hidden='true'
                                  />
                                  <span
                                    className={classNames(
                                      'ml-3 flex-auto truncate',
                                      active
                                        ? 'text-primary-inverted dark:text-primary'
                                        : 'text-primary'
                                    )}
                                  >
                                    {project.name}
                                  </span>
                                  {active && (
                                    <span className='ml-3 flex-none text-indigo-100'>
                                      Jump to...
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          )
                        )}
                      </ul>
                    </li>
                    {query === '' && (
                      <li className='p-2'>
                        <h2 className='sr-only'>Quick actions</h2>
                        <ul className='text-sm text-primary'>
                          {quickActions.map((action) => (
                            <Combobox.Option
                              key={action.shortcut}
                              value={action}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                  active && 'bg-indigo-600 text-white'
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <action.icon
                                    className={classNames(
                                      'h-6 w-6 flex-none',
                                      active ? 'text-white' : 'text-gray-400'
                                    )}
                                    aria-hidden='true'
                                  />
                                  <span className='ml-3 flex-auto truncate'>
                                    {action.name}
                                  </span>
                                  <span
                                    className={classNames(
                                      'ml-3 flex-none text-xs font-semibold',
                                      active
                                        ? 'text-indigo-100'
                                        : 'text-gray-400'
                                    )}
                                  >
                                    <kbd className='font-sans'>⌘</kbd>
                                    <kbd className='font-sans'>
                                      {action.shortcut}
                                    </kbd>
                                  </span>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {query !== '' && filteredProjects.length === 0 && (
                  <div className='px-6 py-14 text-center sm:px-14'>
                    <FolderIcon
                      className='mx-auto h-6 w-6 text-primary'
                      aria-hidden='true'
                    />
                    <p className='mt-4 text-sm text-primary'>
                      We couldn't find any projects with that term. Please try
                      again.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/services/utils';
import { useMutation } from '@apollo/client';
import { DELETE_ISSUE_MUTATION } from '@/gql/gql-queries-mutations';
import { Menu, Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  useParams,
  useSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';

const DeleteDialogue = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [deleteIssue] = useMutation(DELETE_ISSUE_MUTATION);
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useParams();

  function closeModal() {
    setIsOpen(false);
  }

  function confirmDelete() {
    const selectedIssueId = searchParams.get('selectedIssueId');
    const projectId = urlParams.projectId;

    deleteIssue({
      variables: { input: { id: selectedIssueId } },
      update: (cache, { data: { deleteIssue } }) => {
        cache.modify({
          id: cache.identify({
            __typename: 'Project',
            id: `${projectId}`,
          }),
          fields: {
            issues(existingIssues = [], { readField }) {
              return existingIssues.filter(
                (issueRef: any) => selectedIssueId !== readField('id', issueRef)
              );
            },
          },
        });
      },
    });
    params.delete('selectedIssueId');
    // @ts-ignore
    router.replace(pathname + '?' + params.toString());
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-999' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='flex text-lg font-medium leading-6'
                >
                  <FaExclamationTriangle className='mr-2 h-5 w-5 text-red-500' />
                  Delete issue ID: {params.get('selectedIssueId')}?
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm'>
                    You're about to permanently delete this issue, its comments
                    and attachments, and all of its data.
                    <br />
                    <br />
                    If you're not sure, you can resolve or close this issue
                    instead.
                  </p>
                </div>

                <div className='float-right mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={confirmDelete}
                  >
                    Confirm
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const IssueActionsDropdown = ({ issueId }: { issueId?: string }) => {
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const selectedIssueId = issueId ?? params.get('selectedIssueId');

  const [deleteDialogueIsOpen, setDeleteDialogueIsOpen] = useState(false);

  if (!selectedIssueId) return <></>;

  const activeClass = 'bg-surface-overlay-hovered text-primary';
  const inactiveClass = '';

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 p-1 text-sm font-semibold ring-inset ring-gray-900'>
          <EllipsisHorizontalIcon className='h-7 w-7' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-9 mt-0 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-primary/10 bg-surface-overlay shadow-lg focus:outline-none'>
          <div className='py-1'>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Duplicate
                </a>
              )}
            </Menu.Item>
          </div>
          <div className='py-1'>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Archive
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Move
                </a>
              )}
            </Menu.Item>
          </div>
          <div className='py-1'>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Share
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Add to favorites
                </a>
              )}
            </Menu.Item>
          </div>
          <div className='py-1'>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  onClick={() => setDeleteDialogueIsOpen(true)}
                  className={classNames(
                    active ? activeClass : inactiveClass,
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Delete
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
      <DeleteDialogue
        isOpen={deleteDialogueIsOpen}
        setIsOpen={setDeleteDialogueIsOpen}
      />
    </Menu>
  );
};

export default IssueActionsDropdown;

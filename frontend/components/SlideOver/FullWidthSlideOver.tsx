import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FullWidthSlideOver({
  children,
  open,
  setOpen,
  panelTitle,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  panelTitle: string;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-999' onClose={setOpen}>
        <div className='fixed inset-0 max-w-full' />
        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto w-screen max-w-full'>
                  <div className='flex h-full flex-col overflow-y-scroll bg-surface py-6 shadow-xl'>
                    <div className='px-4 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='relative p-2 text-primary/50 hover:text-primary'
                            onClick={() => setOpen(false)}
                          >
                            <span className='absolute -inset-2.5' />
                            <span className='sr-only'>Close panel</span>
                            <XMarkIcon className='h-8 w-8' aria-hidden='true' />
                          </button>
                        </div>
                        <Dialog.Title className='font-semibold leading-6 text-primary'>
                          {panelTitle}
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

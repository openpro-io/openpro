import ToggleBacklog from './ToggleBacklog';
import HideDoneAfter from '@/components/BoardSettings/HideDoneAfter';
import ResetBoardState from '@/components/BoardSettings/ResetBoardState';
import BoardColumns from '@/components/BoardSettings/BoardColumns';

export default function BoardSettings({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) {
  return (
    <form>
      <div className='space-y-12 pt-5'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
          <div>
            <h2 className='font-semibold leading-7'>General</h2>
            <p className='mt-1 text-sm leading-6'>
              This is for general settings
            </p>
          </div>

          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
            <div className='sm:col-span-4'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 '
              >
                Board Name
              </label>
              <div className='mt-2'>
                <div className='flex rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className='block flex-1 rounded border-primary/20 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder=''
                  />
                </div>
              </div>
            </div>

            <div className='col-span-full'>
              <ToggleBacklog projectId={projectId} boardId={boardId} />
            </div>

            <div className='col-span-full'>
              <HideDoneAfter projectId={projectId} boardId={boardId} />
            </div>

            <div className='col-span-full'>
              <BoardColumns projectId={projectId} boardId={boardId} />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
          <div>
            <h2 className=' font-semibold leading-7 '>Notifications</h2>
            <p className='mt-1 text-sm leading-6'>
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>
          </div>

          <div className='max-w-2xl space-y-10 md:col-span-2'>
            <fieldset>
              <legend className='text-sm font-semibold leading-6 '>
                By Email
              </legend>
              <div className='mt-6 space-y-6'>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='comments'
                      name='comments'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label htmlFor='comments' className='font-medium'>
                      Comments
                    </label>
                    <p className='text-gray-500'>
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='candidates'
                      name='candidates'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label htmlFor='candidates' className='font-medium '>
                      Candidates
                    </label>
                    <p className='text-gray-500'>
                      Get notified when a candidate applies for a job.
                    </p>
                  </div>
                </div>
                <div className='relative flex gap-x-3'>
                  <div className='flex h-6 items-center'>
                    <input
                      id='offers'
                      name='offers'
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label htmlFor='offers' className='font-medium '>
                      Offers
                    </label>
                    <p className='text-gray-500'>
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className='text-sm font-semibold leading-6 '>
                Push Notifications
              </legend>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                These are delivered via SMS to your mobile phone.
              </p>
              <div className='mt-6 space-y-6'>
                <div className='flex items-center gap-x-3'>
                  <input
                    id='push-everything'
                    name='push-notifications'
                    type='radio'
                    className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                  />
                  <label
                    htmlFor='push-everything'
                    className='block text-sm font-medium leading-6 '
                  >
                    Everything
                  </label>
                </div>
                <div className='flex items-center gap-x-3'>
                  <input
                    id='push-email'
                    name='push-notifications'
                    type='radio'
                    className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                  />
                  <label
                    htmlFor='push-email'
                    className='block text-sm font-medium leading-6 '
                  >
                    Same as email
                  </label>
                </div>
                <div className='flex items-center gap-x-3'>
                  <input
                    id='push-nothing'
                    name='push-notifications'
                    type='radio'
                    className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                  />
                  <label
                    htmlFor='push-nothing'
                    className='block text-sm font-medium leading-6 '
                  >
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
          <div>
            <h2 className=' font-semibold leading-7'>Debug</h2>
            <p className='mt-1 text-sm leading-6'>
              These are are advanced settings for debugging
            </p>
          </div>

          <div className='max-w-2xl space-y-10 md:col-span-2'>
            <fieldset>
              <legend className='text-sm font-semibold leading-6 '>
                Board Tools
              </legend>
              <div className='mt-6 space-y-6'>
                <div className='relative flex gap-x-3'>
                  <div className='text-sm leading-6'>
                    <ResetBoardState boardId={boardId} />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button type='button' className='text-sm font-semibold leading-6 '>
          Cancel
        </button>
        <button
          type='submit'
          className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Save
        </button>
      </div>
    </form>
  );
}

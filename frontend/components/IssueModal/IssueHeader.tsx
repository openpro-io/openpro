import { XMarkIcon } from '@heroicons/react/20/solid';
import IssueActionsDropdown from './IssueActionsDropdown';

const IssueHeader = ({
  issueId,
  projectKey,
}: {
  issueId: string;
  projectKey: string;
}) => {
  const closeIssueModal = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        altKey: false,
        code: 'Escape',
        ctrlKey: false,
        isComposing: false,
        key: 'Escape',
        location: 0,
        metaKey: false,
        repeat: false,
        shiftKey: false,
        which: 27,
        charCode: 0,
        keyCode: 27,
      })
    );
  };

  return (
    <div className='px-4 py-2 sm:px-6'>
      <div className='-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
        <div className=''>
          <h3 className='font-semibold leading-6'>
            {projectKey}-{issueId}
          </h3>
        </div>
        <div className='ml-4 mt-2 flex-shrink-0'>
          {/* Actions menu dropdown */}
          <IssueActionsDropdown />

          {/* Close modal button*/}
          <button
            type='button'
            className='hover:bg-gray-100'
            // onClick={() => setOpen(false)}
            onClick={() => closeIssueModal()}
          >
            <XMarkIcon className='h-7 w-7' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueHeader;

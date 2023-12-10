import { useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { classNames } from '@/services/utils';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { CreateProjectDetails, CreateProjectType } from '@/constants/types';
import Step2 from './Step2';

const projectSelectionTypes = [
  {
    projectTypeName: 'Kanban',
    projectTypeDescription:
      'Kanban (the Japanese word for "visual signal") is all about helping teams visualize their work, limit work currently in progress, and maximize efficiency. Use the Kanban template to increase planning flexibility, reduce bottlenecks and promote transparency throughout the development cycle.',
    projectTypeIcon: '',
  },
  {
    projectTypeName: 'Scrum',
    projectTypeDescription: 'Coming Soon',
    projectTypeIcon: '',
  },
];

// @ts-ignore
const CreateProjectSelection = ({ onSelectCallback }) => {
  const [projectTypeSelection, setProjectTypeSelection] = useState<
    CreateProjectType | undefined
  >(undefined);
  const [projectDetails, setProjectDetails] = useState<
    CreateProjectDetails | undefined
  >(undefined);

  useEffect(() => {
    if (onSelectCallback && projectTypeSelection) {
      const data = {
        ...projectDetails,
        ...projectTypeSelection,
      };

      setProjectDetails(undefined);
      setProjectTypeSelection(undefined);
      onSelectCallback(data);
    }
  }, [projectDetails]);

  return (
    <>
      {/* STEP 2 */}
      {projectTypeSelection && (
        <>
          <Step2 setProjectDetails={setProjectDetails} />
        </>
      )}

      {/* STEP 1 */}
      {!projectTypeSelection && (
        <RadioGroup
          value={projectTypeSelection}
          onChange={setProjectTypeSelection}
        >
          <RadioGroup.Label className='sr-only'>
            Project Selection Type
          </RadioGroup.Label>
          <div className='space-y-4'>
            {projectSelectionTypes.map((projectSelectionType) => (
              <RadioGroup.Option
                key={projectSelectionType.projectTypeName}
                value={projectSelectionType}
                className={({ active }) =>
                  classNames(
                    active
                      ? 'border-indigo-600 ring-2 ring-indigo-600'
                      : 'border-gray-300 hover:shadow-xl',
                    'relative block cursor-pointer rounded-lg border bg-surface-overlay px-20 py-10 shadow-sm focus:outline-none sm:flex sm:justify-between'
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <span className='my-auto pr-20'>
                      {projectSelectionType.projectTypeName.toLowerCase() ===
                        'kanban' && (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='50'
                          height='50'
                          viewBox='0 0 16 16'
                        >
                          <g fill='blue'>
                            <path d='M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h11zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11z' />
                            <path d='M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3z' />
                          </g>
                        </svg>
                      )}
                      {projectSelectionType.projectTypeName.toLowerCase() ===
                        'scrum' && (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='50'
                          height='50'
                          viewBox='0 0 24 24'
                        >
                          <g
                            fill='none'
                            stroke='blue'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='1.5'
                          >
                            <path d='M17.5 19H22m0 0l-2.5-2.5M22 19l-2.5 2.5M12 2L9.5 4.5L12 7' />
                            <path d='M10.5 4.5a7.5 7.5 0 0 1 0 15H2' />
                            <path d='M6.756 5.5A7.497 7.497 0 0 0 3 12c0 1.688.558 3.246 1.5 4.5' />
                          </g>
                        </svg>
                      )}
                    </span>
                    <span className='flex items-center pr-20'>
                      <span className='flex flex-col text-sm'>
                        <RadioGroup.Label
                          as='span'
                          className='text-2xl font-bold text-primary'
                        >
                          {projectSelectionType.projectTypeName}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as='span'
                          className='text-primary'
                        >
                          <span className='block sm:inline'>
                            {projectSelectionType.projectTypeDescription}
                          </span>
                        </RadioGroup.Description>
                      </span>
                    </span>
                    <RadioGroup.Description
                      as='span'
                      className='flex items-center text-sm'
                    >
                      <span className=''>
                        <ChevronRightIcon className='h-8 w-8 text-primary' />
                      </span>
                    </RadioGroup.Description>
                    <span
                      className={classNames(
                        active ? 'border' : 'border-1',
                        checked ? 'border-indigo-600' : 'border-transparent',
                        'pointer-events-none absolute -inset-px rounded-lg'
                      )}
                      aria-hidden='true'
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </>
  );
};

export default CreateProjectSelection;

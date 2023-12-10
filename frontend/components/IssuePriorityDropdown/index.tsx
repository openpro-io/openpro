import { Combobox } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { priorityToIcon } from '@/components/Icons';

type Priority = {
  name: string;
  id: number;
};

type Props = {
  initialPriorityId: number;
  onChange: (priority: Priority) => void;
};

const defaultPriorities: Priority[] = [
  {
    name: 'Low',
    id: 1,
  },
  {
    name: 'Medium',
    id: 2,
  },
  {
    name: 'Normal',
    id: 3,
  },
  {
    name: 'High',
    id: 4,
  },
  {
    name: 'Critical',
    id: 5,
  },
];

const IssuePriorityDropdown = ({ initialPriorityId, onChange }: Props) => {
  const findPriorityById = (priorityId: number): Priority => {
    return (
      defaultPriorities.find((priority) => priority.id === priorityId) ??
      defaultPriorities[2]
    );
  };

  const [selectedIssuePriority, setSelectedIssuePriority] = useState<Priority>(
    initialPriorityId
      ? findPriorityById(initialPriorityId)
      : defaultPriorities[2]
  );
  const [query, setQuery] = useState('');
  const [priorities] = useState<Priority[]>(defaultPriorities);

  // Inform the parent the user has selected a person
  useEffect(() => {
    if (onChange) onChange(selectedIssuePriority);
  }, [selectedIssuePriority]);

  const filteredPriorities =
    query === ''
      ? priorities
      : priorities.filter((priority) => {
          return priority.name?.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as='div'
      name='IssuePriorityDropdown'
      value={selectedIssuePriority}
      onChange={setSelectedIssuePriority}
    >
      <div className='relative'>
        <div className='flex items-center rounded-md border-0 py-1 pl-3 pr-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 sm:leading-6'>
          {priorityToIcon(selectedIssuePriority.id)}
          <Combobox.Input
            className='w-full border-0 bg-transparent outline-none ring-0 focus:ring-0'
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(priority: Priority) => priority.name}
          />
        </div>

        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
          <ChevronUpDownIcon
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </Combobox.Button>

        <Combobox.Options className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {filteredPriorities.map((priority: Priority) => (
            <Combobox.Option
              key={priority.id}
              value={priority}
              className='ui-not-active:bg-surface-overlay-hovered relative cursor-default select-none py-2 pl-3 pr-9 ui-active:bg-link-active ui-active:text-link-active ui-not-active:text-link'
            >
              <div className='flex items-center'>
                <div>{priorityToIcon(priority.id)}</div>
                <div>{priority.name}</div>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default IssuePriorityDropdown;

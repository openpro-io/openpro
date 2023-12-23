// TODO: there is a CSS bug that crops the dropdown in a modal
import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const linkTypes = [
  { name: 'Blocks', value: 'blocks' },
  { name: 'Blocked By', value: 'blocked_by' },
  { name: 'Duplicates', value: 'duplicates' },
  { name: 'Duplicated By', value: 'duplicated_by' },
  { name: 'Relates To', value: 'relates_to' },
  { name: 'Clones', value: 'clones' },
  { name: 'Is Cloned By', value: 'is_cloned_by' },
];

const LinkIssueTypeDropdown = ({
  selectedLinkType,
  stateCallback,
}: {
  selectedLinkType?: string;
  stateCallback?: (args: any) => void;
}) => {
  const [selected, setSelected] = useState(linkTypes[0]);

  useEffect(() => {
    if (stateCallback) {
      stateCallback((prevState: any) => ({
        ...prevState,
        linkType: selected.value,
      }));
    }
  }, [selected]);

  useEffect(() => {
    if (selectedLinkType) {
      const linkType = linkTypes.find(
        (link) => link.value === selectedLinkType
      );
      if (linkType) {
        setSelected(linkType);

        if (stateCallback) {
          stateCallback((prevState: any) => ({
            ...prevState,
            linkType: linkType.value,
          }));
        }
      }
    }
  }, [selectedLinkType]);

  return (
    <div className='w-72'>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative mt-1 rounded-lg border border-primary/20'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-surface-overlay py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className='block truncate'>{selected.name}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-99 mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface-overlay py-1 text-primary shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {linkTypes.map((link) => (
                <Listbox.Option
                  key={link.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? 'bg-surface-overlay-hovered text-primary'
                        : 'text-primary'
                    }`
                  }
                  value={link}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {link.name}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default LinkIssueTypeDropdown;

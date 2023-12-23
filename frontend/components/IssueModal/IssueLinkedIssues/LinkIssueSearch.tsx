// TODO: Hide the handlebars
// TODO: When searching show results expanded always
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ISSUES_QUERY } from '@/gql/gql-queries-mutations';
import { debounce } from 'lodash';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const LinkIssueSearch = ({
  stateCallback,
}: {
  stateCallback?: (args: any) => void;
}) => {
  const [selected, setSelected] = useState({});
  const [query, setQuery] = useState('');
  const [searchIssues, { data, error, loading }] = useLazyQuery(
    GET_ISSUES_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  );
  const handleChange = (e: any) => {
    setQuery(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  // TODO: Reduce useEffect hooks if we can here.

  useEffect(() => {
    if (selected && stateCallback) {
      stateCallback((prevState: any) => ({
        ...prevState,
        selectedIssue: selected,
      }));
    }
  }, [selected]);

  useEffect(() => {
    if (query) {
      searchIssues({ variables: { input: { search: query } } });
    }
  }, [query]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const filteredIssues = data?.issues ? data.issues : [];

  return (
    <div className='w-full min-w-full'>
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative mt-1 rounded-lg border border-primary/20'>
          <div className='relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Input
              className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0'
              displayValue={(issue: any) => issue?.title}
              onChange={debouncedResults}
              placeholder='Search for an issue'
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {filteredIssues.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredIssues.map((issue: any) => (
                  <Combobox.Option
                    key={issue.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-2 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={issue}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {issue.project.key}-{issue.id}: {issue.title}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default LinkIssueSearch;

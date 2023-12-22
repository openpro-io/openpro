import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { priorityToIcon } from '@/components/Icons';
import { GET_ISSUE_QUERY, GET_ISSUES_QUERY } from '@/gql/gql-queries-mutations';
import { useLazyQuery, useQuery } from '@apollo/client';
import { groupBy, lowerCase, startCase } from 'lodash';
import { BsPlus } from 'react-icons/bs';
import { Issue } from '@/gql/__generated__/graphql';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import { Button } from '@/components/Button';
import { debounce } from 'lodash';

type Links = {
  [key: string]: Issue[];
};

const linkTypes = [
  { name: 'Blocks', value: 'blocks' },
  { name: 'Blocked By', value: 'blocked_by' },
  { name: 'Duplicates', value: 'duplicates' },
  { name: 'Duplicated By', value: 'duplicated_by' },
  { name: 'Relates To', value: 'relates_to' },
  { name: 'Clones', value: 'clones' },
  { name: 'Is Cloned By', value: 'is_cloned_by' },
];

// TODO: Hide the handlebars
// TODO: When searching show results expanded always
const LinkIssueSearch = () => {
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState('');

  const [searchIssues, { data, error, loading }] = useLazyQuery(
    GET_ISSUES_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (query) {
      searchIssues({ variables: { input: { search: query } } });
    }
  }, [query]);

  const handleChange = (e: any) => {
    setQuery(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

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
              displayValue={(issue: any) => issue.title}
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

const LinkIssueTypeDropdown = ({
  selectedLinkType,
}: {
  selectedLinkType?: string;
}) => {
  const [selected, setSelected] = useState(linkTypes[0]);

  useEffect(() => {
    if (selectedLinkType) {
      const linkType = linkTypes.find(
        (link) => link.value === selectedLinkType
      );
      if (linkType) setSelected(linkType);
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
              {linkTypes.map((link, linkIdx) => (
                <Listbox.Option
                  key={linkIdx}
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

const IssueLinkedIssues = ({
  issueId,
  projectKey,
}: {
  issueId?: string;
  projectKey?: string;
}) => {
  const [showCreateLink, setShowCreateLink] = useState(false);
  const { data, error, loading } = useQuery(GET_ISSUE_QUERY, {
    skip: !issueId,
    variables: { input: { id: issueId } },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading linked issues</div>;
  }

  const links: Links = data?.issue?.links
    ? groupBy(data.issue.links, 'linkType')
    : {};

  return (
    <>
      <div className='flex items-center justify-between align-middle'>
        <div className='text-2xl'>Linked Issues</div>
        <div
          className='rounded-md hover:cursor-pointer hover:bg-surface-overlay-hovered'
          onClick={() => {
            setShowCreateLink(true);
          }}
        >
          <BsPlus className='h-6 w-6' />
        </div>
      </div>
      {Object.keys(links).map((linkType) => (
        <div key={linkType}>
          <div className='pb-1 pt-2 text-lg opacity-80'>
            {startCase(lowerCase(linkType))}
          </div>
          {links[linkType].map(({ id, title, priority, status }) => (
            <div
              key={id}
              className='group flex overflow-hidden rounded border border-primary/10 bg-surface-overlay px-2 shadow-sm hover:cursor-pointer hover:bg-surface-overlay-hovered'
            >
              <div className='relative m-1 flex w-full items-center gap-x-1 p-1'>
                <div>
                  <CheckIcon className='h-6 w-6 text-blue-500' />
                </div>
                <div className='text-link-active hover:underline'>
                  {projectKey}-{id}
                </div>
                <div className='ml-4 shrink grow basis-0'>
                  <div className='flex'>
                    <div className='grow hover:underline'>{title}</div>
                  </div>
                </div>
                <div className='flex'>{priorityToIcon(Number(priority))}</div>
                <div className='flex items-center justify-center rounded-md bg-blue-500 px-2 text-primary-inverted'>
                  {status?.name}
                </div>
                <div className='right-0 opacity-0 hover:cursor-pointer hover:rounded-md hover:bg-surface-overlay group-hover:opacity-100'>
                  <XMarkIcon className='h-6 w-6' />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      {showCreateLink && (
        <>
          <div className='flex items-center gap-x-1 pt-2'>
            <LinkIssueTypeDropdown />
            <div className='grow'>
              <LinkIssueSearch />
            </div>
          </div>
          <div className='flex justify-between pt-1'>
            <div></div>
            <div className='space-x-1'>
              <Button
                variant='primary'
                onClick={() => {
                  //   TODO:
                }}
              >
                Link
              </Button>
              <Button
                variant='transparent'
                onClick={() => setShowCreateLink(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default IssueLinkedIssues;

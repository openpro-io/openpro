import { useEffect, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import { classNames, formatUser } from '@/services/utils';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/gql/gql-queries-mutations';
import UserSelectionAvatar from '@/components/UserSelectionAvatar';
import { User } from '@/gql/__generated__/graphql';

// TODO: Add unassigned user

const initialPeople = [
  {
    id: '0',
    name: 'Unassigned',
    avatarUrl: '',
  },
];

const UserSelectionDropdown = ({
  initialPerson,
  selectedPersonCallback,
}: {
  initialPerson: User | undefined;
  selectedPersonCallback: (args: any) => void;
}) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<User | undefined>(
    initialPerson ? formatUser(initialPerson) : initialPeople[0]
  );
  const [people, setPeople] = useState(initialPeople);

  const { data, loading } = useQuery(GET_USERS);

  useEffect(() => {
    if (!loading && data) {
      setPeople([...people, ...data.users.map((u: User) => formatUser(u))]);
    }
  }, [data, loading]);

  // TODO: we should look into why we need this
  useEffect(() => {
    if (initialPerson) {
      setSelectedPerson(formatUser(initialPerson));
    }
  }, [initialPerson]);

  // Inform the parent the user has selected a person
  useEffect(() => {
    if (selectedPersonCallback) selectedPersonCallback(selectedPerson);
  }, [selectedPerson]);

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person: User) => {
          return person?.name?.toLowerCase().includes(query.toLowerCase());
        });

  // TODO: This design is bad
  return (
    <Combobox
      as='div'
      name='UserSelectionDropdown'
      value={selectedPerson}
      onChange={setSelectedPerson}
    >
      <div className='relative'>
        <div className='flex items-center rounded-md border-0 py-1 pl-3 pr-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 sm:leading-6'>
          <UserSelectionAvatar selectedPerson={selectedPerson} />
          <Combobox.Input
            className='w-full border-0 bg-transparent outline-none ring-0 focus:ring-0'
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(person: User): string => person?.name ?? ''}
          />
        </div>

        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
          <ChevronUpDownIcon
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-surface-overlay-hovered py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {filteredPeople.map((person: User) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-link-active' : 'text-link'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className='flex items-center'>
                      {person.avatarUrl && (
                        <img
                          src={person.avatarUrl ?? ''}
                          alt=''
                          className='h-8 w-8 flex-shrink-0 rounded-full'
                        />
                      )}

                      {!person.avatarUrl && (
                        <span className='inline-block h-8 w-8 overflow-hidden rounded-full'>
                          <svg
                            className='h-full w-full text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                          </svg>
                        </span>
                      )}
                      <span
                        className={classNames(
                          'ml-3 truncate',
                          selected && 'font-semibold'
                        )}
                      >
                        {person.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-link-active' : 'text-link'
                        )}
                      >
                        <CheckIcon className='h-5 w-5' aria-hidden='true' />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default UserSelectionDropdown;

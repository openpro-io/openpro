import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/gql/gql-queries-mutations';
import { classNames, formatUser } from '@/services/utils';

import { User } from '@/constants/types';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { useSession } from 'next-auth/react';

const UserAvatarBubbleWide = ({
  selectedPerson,
  disable = false,
}: {
  selectedPerson: User | undefined;
  disable?: boolean;
}) => {
  return (
    <div className='flex w-32 flex-row items-center gap-x-2 px-1 py-0.5'>
      <UserAvatarBubble selectedPerson={selectedPerson} enableTooltip={false} />
      <div>{selectedPerson?.name}</div>
    </div>
  );
};

const UserAvatarBubble = ({
  selectedPerson,
  enableTooltip = true,
  disable = false,
}: {
  selectedPerson: User | undefined;
  enableTooltip?: boolean;
  disable?: boolean;
}) => {
  if (selectedPerson) {
    if (selectedPerson?.avatarUrl) {
      return (
        <div
          className={classNames(
            disable && 'z-9 opacity-60',
            'group relative z-99 cursor-pointer hover:z-999'
          )}
        >
          <img
            src={selectedPerson.avatarUrl ?? ''}
            alt='User'
            className='inline-block h-8 w-8 rounded-full ring-2 ring-white'
          />
          {enableTooltip && (
            <div className='absolute -left-10 -top-20 mt-12 hidden w-max rounded bg-gray-800 px-2 py-1 text-sm text-white opacity-75 shadow-lg group-hover:block'>
              {selectedPerson.name}
            </div>
          )}
        </div>
      );
    }

    // If no avatar, show initials if first and last name present
    if (selectedPerson.firstName && selectedPerson.lastName) {
      return (
        <div
          className={classNames(
            disable && 'z-9 opacity-60',
            'group relative z-99 cursor-pointer hover:z-999'
          )}
        >
          <span className='ring-ring-surface-overlay inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-overlay ring-2'>
            <span className='text-sm font-medium leading-none text-primary'>
              {selectedPerson.firstName[0]}
              {selectedPerson.lastName[0]}
            </span>
          </span>
        </div>
      );
    }

    // If no avatar and no first and last name, show icon
    return (
      <div
        className={classNames(
          disable && 'z-9 opacity-60',
          'group relative z-99 cursor-pointer hover:z-999'
        )}
      >
        <span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-surface ring-2 ring-white'>
          <svg
            className='h-full w-full text-gray-300'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
          </svg>
        </span>
        {enableTooltip && (
          <div className='absolute -left-10 -top-20 mt-12 hidden w-max rounded bg-gray-800 px-2 py-1 text-sm text-white opacity-75 shadow-lg group-hover:block'>
            {selectedPerson.name}
          </div>
        )}
      </div>
    );
  }

  return <></>;
};

const AssignedUserFilter = () => {
  const { data } = useQuery(GET_USERS);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchParams = useSearchParams()!;
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const handleButtonClick = useCallback(() => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  }, []);

  const setSelectedUserId = useCallback(
    (userId: string) => {
      if (userId) {
        params.set('selectedUserId', userId);
      } else {
        params.delete('selectedUserId');
      }

      const newPath = pathname + '?' + params.toString();
      router.replace(newPath as Route);
    },
    [params, pathname, router]
  );

  const mapUsers = useCallback((users: any) => {
    return users.map((u: any) => formatUser(u));
  }, []);

  const users = data ? mapUsers(data.users) : [];

  return (
    <div className='relative flex h-9 w-max flex-row -space-x-2'>
      {users?.slice(0, 5).map((user: any, index: number) => {
        return (
          <div
            key={user.id}
            onClick={() => {
              if (params.get('selectedUserId') === user.id) {
                setSelectedUserId('');
              } else {
                setSelectedUserId(user.id);
              }
            }}
          >
            <UserAvatarBubble
              selectedPerson={user}
              disable={
                params.get('selectedUserId') !== null &&
                params.get('selectedUserId') !== user.id
              }
            />
          </div>
        );
      })}

      {users?.length > 5 && (
        <button
          onClick={handleButtonClick}
          className={classNames(
            params.get('selectedUserId') !== null &&
              !users
                .slice(5)
                .map((user: any) => user.id)
                .includes(params.get('selectedUserId'))
              ? 'opacity-60'
              : '',
            'group relative z-99 h-8 w-8 rounded-full bg-surface ring-2 ring-white'
          )}
        >
          +{users.length - 5}
          {showDropdown && (
            <div className='absolute left-1 mt-3 w-max rounded border border-primary/10 bg-surface px-1 py-1 text-sm text-primary shadow-lg hover:bg-surface-overlay-hovered'>
              {users.slice(5).map((user: any) => (
                <div
                  key={user.id}
                  className='py-1'
                  onClick={() => {
                    if (params.get('selectedUserId') === user.id) {
                      setSelectedUserId('');
                    } else {
                      setSelectedUserId(user.id);
                    }
                  }}
                >
                  <UserAvatarBubbleWide selectedPerson={user} />
                </div>
              ))}
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default AssignedUserFilter;

import { PlusIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_USER_TO_PROJECT_MUTATION,
  GET_PROJECT_INFO,
  GET_USERS,
  REMOVE_USER_FROM_PROJECT_MUTATION,
} from '@/gql/gql-queries-mutations';
import { User } from '@/gql/__generated__/graphql';
import { formatUserFullName } from '@/services/utils';
import Avatar from '@/components/Avatar';
import React from 'react';
import { useSession } from 'next-auth/react';
import useProjectMembers from '@/hooks/useProjectMembers';
export default function ProjectMemberInvite({
  projectId,
}: {
  projectId: string;
}) {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_PROJECT_INFO, {
    variables: {
      input: {
        id: projectId,
      },
    },
  });
  const getUsers = useQuery(GET_USERS);
  const { handleAddMember, handleRemoveMember } = useProjectMembers(projectId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='mx-auto max-w-md sm:max-w-3xl'>
      <div>
        <div className='text-center'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 48 48'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
          <h2 className='mt-2 font-semibold leading-6 text-primary'>
            Add team members
          </h2>
          <div className='primary mt-1 text-sm'>
            {data.project.users && data.project.users.length > 0 ? (
              data.project.users
                .filter((user: User) => {
                  return user.externalId !== session?.user?.id;
                })
                .map((user: User) => (
                  <div
                    key={user.id}
                    className='relative flex h-10 w-fit flex-row items-center justify-center rounded border border-primary/20 bg-surface-overlay px-2 py-2 text-primary'
                    role='alert'
                  >
                    <div className='font-bold'>{user.email}</div>
                    <div
                      className='pl-1'
                      onClick={() => handleRemoveMember(user)}
                    >
                      <svg
                        className='h-5 w-5 fill-current text-red-500'
                        role='button'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                      >
                        <title>Close</title>
                        <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z'></path>
                      </svg>
                    </div>
                  </div>
                ))
            ) : (
              <div>You haven’t added any team members to your project yet.</div>
            )}
          </div>
        </div>
        <form className='mt-6 sm:flex sm:items-center' action='#'>
          <label htmlFor='emails' className='sr-only'>
            Email addresses
          </label>
          <div className='grid grid-cols-1 sm:flex-auto'>
            <input
              type='text'
              name='emails'
              id='emails'
              className='peer relative col-start-1 row-start-1 border-0 bg-transparent py-1.5 text-primary placeholder:text-primary/50 focus:ring-0 sm:text-sm sm:leading-6'
              placeholder='Enter an email'
            />
            <div
              className='col-start-1 col-end-3 row-start-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-600'
              aria-hidden='true'
            />
            <div className='col-start-2 row-start-1 flex items-center'>
              <span
                className='h-4 w-px flex-none bg-surface'
                aria-hidden='true'
              />
              <label htmlFor='role' className='sr-only'>
                Role
              </label>
              <select
                id='role'
                name='role'
                className='rounded-md border-0 bg-transparent py-1.5 pl-4 pr-7 text-primary focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              >
                <option>Can edit</option>
                <option>Can view</option>
              </select>
            </div>
          </div>
          <div className='mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0'>
            <button
              type='submit'
              className='block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-primary shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Send invite
            </button>
          </div>
        </form>
      </div>
      <div className='mt-10'>
        <h3 className='text-sm font-medium text-primary'>
          Recommended team members
        </h3>
        <ul role='list' className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {getUsers.data?.users
            ?.filter((user: User) => {
              return !data.project.users?.some(
                (projectUser: User) => projectUser.id === user.id
              );
            })
            ?.map((user: User) => (
              <li key={user.id}>
                <button
                  type='button'
                  className='group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-surface-overlay-hovered focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  <span className='flex min-w-0 flex-1 items-center space-x-3'>
                    <span className='relative flex flex-shrink-0 items-center justify-center'>
                      <Avatar person={user} className='!h-10 !w-10' />
                    </span>
                    <span className='block min-w-0 flex-1'>
                      <span className='block truncate text-sm font-medium text-primary'>
                        {formatUserFullName(user)}
                      </span>
                      <span className='block truncate text-sm font-medium text-primary/50'>
                        {user.email}
                      </span>
                    </span>
                  </span>
                  <span className='inline-flex h-10 w-10 flex-shrink-0 items-center justify-center'>
                    <PlusIcon
                      onClick={() => handleAddMember(user)}
                      className='h-5 w-5 text-primary group-hover:text-primary'
                      aria-hidden='true'
                    />
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

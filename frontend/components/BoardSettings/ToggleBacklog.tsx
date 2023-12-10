import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '@/services/utils';
import {
  GET_BOARD_INFO,
  UPDATE_BOARD_MUTATION,
} from '@/gql/gql-queries-mutations';
import { useMutation, useQuery } from '@apollo/client';

const ToggleBacklog = ({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) => {
  const { data } = useQuery(GET_BOARD_INFO, {
    variables: { input: { id: boardId } },
  });
  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);

  const enabled = data?.board?.backlogEnabled ?? false;

  const handleChange = (status: boolean) => {
    updateBoard({
      variables: {
        input: {
          id: boardId,
          backlogEnabled: status,
        },
      },
    });
  };

  return (
    <Switch.Group as='div' className='flex items-center'>
      <Switch
        checked={enabled}
        onChange={handleChange}
        className={classNames(
          !!enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden='true'
          className={classNames(
            !!enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as='span' className='ml-3 text-sm'>
        <span className='font-medium'>Enable backlog</span>
      </Switch.Label>
    </Switch.Group>
  );
};

export default ToggleBacklog;

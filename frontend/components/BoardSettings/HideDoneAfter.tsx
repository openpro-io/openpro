import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { classNames, setBoardSetting } from '@/services/utils';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_BOARD_INFO,
  UPDATE_BOARD_MUTATION,
} from '@/gql/gql-queries-mutations';

type HideDoneAfterState = {
  enabled: boolean;
  days: number;
};

const HideDoneAfter = ({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) => {
  const [hideDoneAfterState, setHideDoneAfterState] =
    useState<HideDoneAfterState>({
      enabled: false,
      days: 0,
    });

  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);
  const { data } = useQuery(GET_BOARD_INFO, {
    skip: !boardId,
    variables: { input: { id: boardId } },
  });

  useEffect(() => {
    if (data?.board?.settings?.hideDoneAfter) {
      setHideDoneAfterState((prevState) => ({
        ...prevState,
        enabled: true,
        days: data?.board?.settings?.hideDoneAfter,
      }));
    }
  }, [data]);

  const onDoneAfterDaysChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const days = Number(e.target.value);

    setHideDoneAfterState((prevState) => ({
      ...prevState,
      days,
    }));

    if (!hideDoneAfterState.enabled) return;

    await updateBoard({
      variables: {
        input: {
          id: boardId,
          settings: setBoardSetting(
            data?.board?.settings,
            'hideDoneAfter',
            days
          ),
        },
      },
    });
  };

  const handleEnableHideDoneAfterChange = (status: boolean) => {
    setHideDoneAfterState((prevState) => ({
      ...prevState,
      enabled: status,
    }));

    updateBoard({
      variables: {
        input: {
          id: boardId,
          settings: setBoardSetting(
            data?.board?.settings,
            'hideDoneAfter',
            status ? Number(hideDoneAfterState.days) : null
          ),
        },
      },
    });
  };

  return (
    <div className='flex flex-col'>
      <Switch.Group as='div' className='flex items-center pb-4'>
        <Switch
          checked={hideDoneAfterState.enabled}
          onChange={handleEnableHideDoneAfterChange}
          className={classNames(
            hideDoneAfterState.enabled
              ? 'bg-indigo-600'
              : 'bg-surface-overlay-hovered',
            'border-1 relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-1'
          )}
        >
          <span
            aria-hidden='true'
            className={classNames(
              hideDoneAfterState.enabled ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        <Switch.Label as='span' className='ml-3 text-sm'>
          <span className='font-medium'>Enable Hide Done After</span>
        </Switch.Label>
      </Switch.Group>

      {hideDoneAfterState.enabled && (
        <div className='flex flex-row'>
          <input
            type='number'
            name='hideDoneAfter'
            id='hideDoneAfter'
            className='block w-32 rounded-md border-gray-300 bg-surface-overlay pr-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            value={hideDoneAfterState.days}
            onChange={onDoneAfterDaysChange}
          />
          <div className='pl-3'>Days</div>
        </div>
      )}
    </div>
  );
};

export default HideDoneAfter;

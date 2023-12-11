import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { classNames, setBoardSetting } from '@/services/utils';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_BOARD_INFO,
  UPDATE_BOARD_MUTATION,
} from '@/gql/gql-queries-mutations';

const HideDoneAfter = ({
  projectId,
  boardId,
}: {
  projectId: string;
  boardId: string;
}) => {
  const [hideDoneAfter, setHideDoneAfter] = useState<number>(0);
  const [enabled, setEnabled] = useState<boolean>(false);

  const [updateBoard] = useMutation(UPDATE_BOARD_MUTATION);
  const { data } = useQuery(GET_BOARD_INFO, {
    skip: !boardId,
    variables: { input: { id: boardId } },
  });

  useEffect(() => {
    if (data?.board?.settings?.hideDoneAfter) {
      setEnabled(true);
      setHideDoneAfter(data?.board?.settings?.hideDoneAfter);
    }
  }, [data]);

  const onDoneAfterDaysChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const days = Number(e.target.value);
    setHideDoneAfter(days);

    if (!enabled) return;

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
    setEnabled(status);

    updateBoard({
      variables: {
        input: {
          id: boardId,
          settings: setBoardSetting(
            data?.board?.settings,
            'hideDoneAfter',
            status ? Number(hideDoneAfter) : null
          ),
        },
      },
    });
  };

  return (
    <div className='flex flex-col'>
      <Switch.Group as='div' className='flex items-center pb-4'>
        <Switch
          checked={enabled}
          onChange={handleEnableHideDoneAfterChange}
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
          <span className='font-medium'>Enable Hide Done After</span>
        </Switch.Label>
      </Switch.Group>

      {enabled && (
        <div className='flex flex-row'>
          <input
            type='number'
            name='hideDoneAfter'
            id='hideDoneAfter'
            className='block w-32 rounded-md border-gray-300 pr-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            value={hideDoneAfter}
            onChange={onDoneAfterDaysChange}
          />
          <div className='pl-3'>Days</div>
        </div>
      )}
    </div>
  );
};

export default HideDoneAfter;

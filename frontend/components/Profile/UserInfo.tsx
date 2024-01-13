import { useLazyQuery, useMutation } from '@apollo/client';
import { Switch } from '@headlessui/react';
import { isEqual, pick } from 'lodash';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { GET_ME, UPDATE_ME } from '@/gql/gql-queries-mutations';
import { classNames } from '@/services/utils';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  settings: {
    celebrateCompletedIssue: boolean;
  };
};

const ToggleCelebrateCompletedIssue = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (...event: any[]) => void;
}) => {
  return (
    <Switch.Group as='div' className='flex items-center'>
      <Switch
        checked={checked}
        onChange={onChange}
        className={classNames(
          !!checked ? 'bg-indigo-600' : 'bg-surface-overlay-hovered',
          'border-1 relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-1'
        )}
      >
        <span
          aria-hidden='true'
          className={classNames(
            !!checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as='span' className='ml-3 text-sm'>
        <span className='font-medium'>Enable Celebrate Completed Issue</span>
      </Switch.Label>
    </Switch.Group>
  );
};

const formFieldsWeCanUpdate = ['firstName', 'lastName', 'settings'];

const inputClasses =
  'block bg-surface text-primary w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-primary/40 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:border-slate-200 disabled:bg-surface-overlay disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed';

export const UserInfo = () => {
  const [loadDbUser] = useLazyQuery(GET_ME);
  const [updateMe] = useMutation(UPDATE_ME);

  const {
    control,
    register,
    handleSubmit,
    formState: { defaultValues },
  } = useForm<Inputs>({
    defaultValues: async () => {
      const dbUser = await loadDbUser();

      const settings = JSON.parse(dbUser.data.me.settings);

      return {
        firstName: dbUser.data.me.firstName,
        lastName: dbUser.data.me.lastName,
        email: dbUser.data.me.email,
        settings: {
          celebrateCompletedIssue: settings.celebrateCompletedIssue ?? true,
        },
      };
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dataToSubmit = pick(data, formFieldsWeCanUpdate);

    if (isEqual(pick(defaultValues, formFieldsWeCanUpdate), dataToSubmit)) {
      return;
    }

    // @ts-ignore
    dataToSubmit.settings = JSON.stringify(dataToSubmit.settings);

    return updateMe({
      variables: {
        input: dataToSubmit,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
        <div className='sm:col-span-3'>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium leading-6'
          >
            First name
          </label>
          <div className='relative mt-2'>
            <input className={inputClasses} {...register('firstName')} />
          </div>
        </div>

        <div className='sm:col-span-3'>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium leading-6'
          >
            Last name
          </label>
          <div className='relative mt-2'>
            <input className={inputClasses} {...register('lastName')} />
          </div>
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='email'
            className='block text-sm font-medium leading-6'
          >
            Email address
          </label>
          <div className='relative mt-2'>
            <input
              className={inputClasses}
              {...register('email', { disabled: true })}
            />
          </div>
        </div>

        {/* Celebrate completed issue */}
        <div className='sm:col-span-6'>
          <Controller
            control={control}
            name='settings.celebrateCompletedIssue'
            render={({ field: { value, onChange } }) => (
              <ToggleCelebrateCompletedIssue
                checked={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <Button type='submit'>Submit</Button>
      </div>
    </form>
  );
};

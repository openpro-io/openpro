import React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ME, UPDATE_ME } from '@/gql/gql-queries-mutations';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { isEqual, pick } from 'lodash';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
};

const formFieldsWeCanUpdate = ['firstName', 'lastName'];

const inputClasses =
  'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none';

export const UserInfo = () => {
  const [loadDbUser] = useLazyQuery(GET_ME);
  const [updateMe] = useMutation(UPDATE_ME);

  const {
    register,
    handleSubmit,
    formState: { defaultValues },
  } = useForm<Inputs>({
    defaultValues: async () => {
      const dbUser = await loadDbUser();

      return {
        firstName: dbUser.data.me.firstName,
        lastName: dbUser.data.me.lastName,
        email: dbUser.data.me.email,
      };
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dataToSubmit = pick(data, formFieldsWeCanUpdate);

    if (isEqual(pick(defaultValues, formFieldsWeCanUpdate), dataToSubmit)) {
      return;
    }

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

        <Button type='submit'>Submit</Button>
      </div>
    </form>
  );
};

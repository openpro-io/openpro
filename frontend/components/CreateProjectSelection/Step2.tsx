import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useField, useFormik, useFormikContext } from 'formik';
import React, { Dispatch, Fragment, SetStateAction } from 'react';
import { object, string } from 'yup';

import { Button } from '@/components/Button';
import { CreateProjectDetails } from '@/constants/types';
import { CREATE_PROJECT_VALIDATION_QUERY } from '@/gql/gql-queries-mutations';
import { apolloClient } from '@/services/apollo-client';

// Function to check if the field is unique
const createProjectValidationQuery = async ({
  name,
  key,
}: {
  name?: string;
  key?: string;
}) => {
  const response = await apolloClient.query({
    fetchPolicy: 'network-only',
    query: CREATE_PROJECT_VALIDATION_QUERY,
    variables: {
      input: {
        name,
        key,
      },
    },
  });

  return response.data.createProjectValidation.status === 'success';
};

const projectVisibilityOptions = [
  { key: 'PRIVATE', value: 'PRIVATE' },
  { key: 'INTERNAL', value: 'INTERNAL' },
  { key: 'PUBLIC', value: 'PUBLIC' },
];

const projectDetailsSchema = object({
  name: string()
    .required()
    .test('is-unique', 'The name must be unique', async (value) => {
      if (!value) {
        return true; // skipping validation if the field is empty
      }

      return await createProjectValidationQuery({ name: value });
    }),
  key: string()
    .uppercase()
    .strict()
    .required()
    .min(2)
    .max(10)
    .matches(/^[A-Z]+/gi, 'Begins with a letter')
    .matches(/[0-9A-Z]+$/gi, 'Enter alphanumeric only')
    .test('is-unique', 'The key must be unique', async (value) => {
      if (!value) {
        return true; // skipping validation if the field is empty
      }

      return await createProjectValidationQuery({ key: value });
    }),
  visibility: string()
    .oneOf(projectVisibilityOptions.map((x) => x.value))
    .required(),
});

interface FormikProps {
  initialValues: {
    [key: string]: string;
  };
  values: {
    [key: string]: string;
  };
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  // include other needed formik methods and properties here
}

interface SelectProps {
  formik: FormikProps;
  name: string;
  label: string;
  options: { key: string; value: string }[];
}

const ProjectVisibilityDropdown: React.FC<SelectProps> = ({
  formik,
  name,
  label,
  options,
}) => {
  return (
    <Listbox
      name={name}
      value={formik.values[name]}
      onChange={(value: string) => {
        console.log({ value });
        formik.setFieldValue(name, value);
      }}
    >
      <div className='relative mt-1'>
        <Listbox.Button className='relative w-full cursor-default rounded-lg bg-surface-overlay py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
          <span className='block truncate'>{formik.values[name]}</span>
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
          <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface-overlay py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
            {options.map((option) => (
              <Listbox.Option
                key={option.key}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-300 text-blue-900' : 'text-primary'
                  }`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.value}
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
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
  );
};

// TODO: make sure key + name is unique in the database for projects
const Step2 = ({
  setProjectDetails,
}: {
  setProjectDetails: Dispatch<SetStateAction<CreateProjectDetails | undefined>>;
}) => {
  const formik = useFormik({
    initialValues: {
      key: '',
      name: '',
      visibility: 'INTERNAL',
    },
    validationSchema: projectDetailsSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      setProjectDetails(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='space-y-12 text-primary'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
          <div>
            <h2 className='font-semibold leading-7'>
              Project Selection Details
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
            <div className='sm:col-span-4'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6'
              >
                Project Name
              </label>
              <div className='mt-2'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder='Name of project'
                    onChange={(e) => {
                      const value = e.target.value || '';
                      formik.setFieldValue('name', value);
                      formik.setFieldValue('key', value.toUpperCase());
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className='text-red-500'>{formik.errors.name}</div>
                ) : null}
              </div>
            </div>

            <div className='sm:col-span-4'>
              <label
                htmlFor='key'
                className='block text-sm font-medium leading-6'
              >
                Key
              </label>
              {/* project keys must start with an uppercase letter, followed by one or more uppercase alphanumeric characters. */}
              {/* The project key must not exceed 10 characters in length. */}
              <div className='mt-2'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='text'
                    name='key'
                    id='key'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder='Project Key'
                    onChange={(e) => {
                      const value = e.target.value || '';
                      formik.setFieldValue('key', value.toUpperCase());
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.key}
                  />
                </div>
                {formik.touched.key && formik.errors.key ? (
                  <div className='text-red-500'>{formik.errors.key}</div>
                ) : null}
              </div>
            </div>

            <div className='sm:col-span-4'>
              <label
                htmlFor='visibility'
                className='block text-sm font-medium leading-6'
              >
                Visibility
              </label>
              <div className='mt-2'>
                <ProjectVisibilityDropdown
                  formik={formik}
                  name='visibility'
                  label='Visibility'
                  options={projectVisibilityOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-2'>
        {/* TODO: Close on click */}
        {/*<Button type='button' variant='gray'>*/}
        {/*  Cancel*/}
        {/*</Button>*/}
        <Button type='submit'>Submit</Button>
        {/*<button*/}
        {/*  type='submit'*/}
        {/*  className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'*/}
        {/*>*/}
        {/*  Save*/}
        {/*</button>*/}
      </div>
    </form>
  );
};

export default Step2;

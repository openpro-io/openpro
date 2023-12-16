import { Dispatch, SetStateAction } from 'react';
import { CreateProjectDetails } from '@/constants/types';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { apolloClient } from '@/services/apollo-client';
import { CREATE_PROJECT_VALIDATION_QUERY } from '@/gql/gql-queries-mutations';
import { Button } from '@/components/Button';

// Function to check if the field is unique
const createProjectValidationQuery = async ({
  name,
  key,
}: {
  name?: string;
  key?: string;
}) => {
  console.log({ name, key });
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
});

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
              {/* Project keys must start with an uppercase letter, followed by one or more uppercase alphanumeric characters. */}
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

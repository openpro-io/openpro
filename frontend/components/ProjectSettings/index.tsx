import { useQuery } from '@apollo/client';

import { GET_PROJECT_INFO } from '@/gql/gql-queries-mutations';

import ProjectMembers from './ProjectMembers';

export default function ProjectSettings({ projectId }: { projectId: string }) {
  const { data, loading, error } = useQuery(GET_PROJECT_INFO, {
    fetchPolicy: 'cache-first',
    variables: {
      input: {
        id: projectId,
      },
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='space-y-12 pt-5'>
      <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
        <div>
          <h2 className='font-semibold leading-7'>General</h2>
          <div className='mt-1 text-sm leading-6'>
            This is for general settings
          </div>
        </div>

        <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
          <div className='sm:col-span-4'>
            <label
              htmlFor='name'
              className='block text-sm font-medium leading-6 '
            >
              Project Name
            </label>
            <div className='mt-2'>
              <div className='flex rounded-md shadow-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='block flex-1 rounded border-primary/20 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                  placeholder=''
                />
              </div>
            </div>
          </div>

          <div className='sm:col-span-4'>
            <div className='mt-2'>Project Visibility</div>
            <div>{data.project.visibility ?? 'undefined'}</div>
          </div>

          <div className='col-span-full'>
            <ProjectMembers projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useFragment } from '@apollo/client';
import { ISSUE_FIELDS, PROJECT_FIELDS } from '@/gql/gql-queries-mutations';

const ProjectContainerSection = () => {
  const pathname = usePathname();
  const urlParams = useParams();
  const projectId = urlParams?.projectId;

  const getProject = useFragment({
    fragment: PROJECT_FIELDS,
    from: {
      __typename: 'Project',
      id: projectId,
    },
  });

  if (!pathname.includes('projects')) {
    return <></>;
  }

  return (
    <section className='flex w-full items-start px-1 pb-8'>
      <img
        src='https://admin.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10400?size=large'
        width='28'
        height='28'
        alt='project'
        className='rounded-[3px]'
      />
      <div className='ml-4 w-full'>
        <p className='font-primary-bold text-md font-extrabold leading-4'>
          {getProject?.data?.name}
        </p>
        <p className='mt-1 line-clamp-2 whitespace-normal text-sm leading-4'>
          Software project
        </p>
      </div>
    </section>
  );
};

export default ProjectContainerSection;

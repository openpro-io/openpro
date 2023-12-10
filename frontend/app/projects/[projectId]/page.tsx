'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

// @ts-ignore
const ProjectPage = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

  return (
    <>
      {/*<Breadcrumb*/}
      {/*  paths={[*/}
      {/*    { name: 'Projects', path: '/projects' },*/}
      {/*    { name: projectId, path: `/projects/${projectId}` },*/}
      {/*  ]}*/}
      {/*/>*/}

      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <div className='col-span-12'>
          <div className='col-span-1 col-start-1 text-3xl font-extrabold'>
            {projectId} Project
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;

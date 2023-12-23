'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ProjectSettings from '@/components/ProjectSettings';

const ProjectSettingsPage = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

  return (
    <>
      <Breadcrumb
        paths={[
          {
            name: `Project ${projectId}`,
            href: `/projects/${projectId}`,
            current: false,
          },
          {
            name: 'Settings',
            href: `/projects/${projectId}/settings`,
            current: true,
          },
        ]}
      />

      <div className='w-65 md:flex md:items-center md:justify-between'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight'>
            Project {projectId} Settings
          </h2>
        </div>
      </div>

      <ProjectSettings projectId={projectId} />
    </>
  );
};

export default ProjectSettingsPage;

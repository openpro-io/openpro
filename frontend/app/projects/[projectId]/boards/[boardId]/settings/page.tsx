'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import BoardSettings from '@/components/BoardSettings';

const ProjectPage = ({
  params,
}: {
  params: { projectId: string; boardId: string };
}) => {
  const { projectId, boardId } = params;

  return (
    <>
      <Breadcrumb
        paths={[
          {
            name: `Project ${projectId} Board ${boardId}`,
            href: `/projects/${projectId}/boards/${boardId}`,
            current: false,
          },
          {
            name: 'Settings',
            href: `/projects/${projectId}/boards/${boardId}/settings`,
            current: true,
          },
        ]}
      />

      <div className='w-65 md:flex md:items-center md:justify-between'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight'>
            Project {projectId} Board {boardId} Settings
          </h2>
        </div>
      </div>

      <BoardSettings projectId={projectId} boardId={boardId} />
    </>
  );
};

export default ProjectPage;

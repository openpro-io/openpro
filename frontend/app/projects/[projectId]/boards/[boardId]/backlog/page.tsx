'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Backlog from '@/components/Backlog';

// @ts-ignore
const ProjectBacklogPage = ({
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
            name: `Board ${boardId} Backlog`,
            href: `/projects/${projectId}/backlog/${boardId}/backlog`,
            current: true,
          },
        ]}
      />

      <div className='w-65 md:flex md:items-center md:justify-between'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight'>
            Board {boardId} Backlog
          </h2>
        </div>
      </div>

      <Backlog projectId={projectId} />
    </>
  );
};

export default ProjectBacklogPage;

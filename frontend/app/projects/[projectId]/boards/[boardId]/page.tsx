'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import KanbanBoardNew from '../../../../../components/KanbanBoard';
import { FaGear } from 'react-icons/fa6';
import Link from 'next/link';

const BoardIdPage = ({
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
            name: `Project ${projectId} Board`,
            href: `/projects/${projectId}/boards/${boardId}`,
            current: true,
          },
        ]}
      />

      <div className='items-center justify-between pb-5 md:flex'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight'>
            Project {projectId} Board
          </h2>
        </div>
        <div>
          <Link
            className='inline-flex w-full justify-center gap-x-1.5 p-2 text-sm text-gray-600 ring-inset ring-gray-900'
            href={`/projects/${projectId}/boards/${boardId}/settings`}
          >
            <FaGear className='h-6 w-6' />
          </Link>
        </div>
      </div>

      <KanbanBoardNew projectId={projectId} boardId={boardId} />
    </>
  );
};

export default BoardIdPage;

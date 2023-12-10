'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import IssueExplorer from '@/components/IssueExplorer';

const ProjectIssuesPage = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;

  console.log('ISSUEVIEW', params);

  return (
    <>
      <Breadcrumb
        paths={[
          {
            name: `Project ${projectId} Issues`,
            href: `/projects/${projectId}/issues`,
            current: true,
          },
        ]}
      />
      <div className='items-center justify-between pb-5 md:flex'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight'>
            Project {projectId} Issues
          </h2>
        </div>
      </div>
      <IssueExplorer projectId={projectId} />
    </>
  );
};

export default ProjectIssuesPage;

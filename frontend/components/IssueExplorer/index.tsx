'use client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_INFO } from '@/gql/gql-queries-mutations';
import IssueCard from '@/components/IssueExplorer/IssueCard';
import { Issue } from '@/constants/types';
import IssueOverview from '@/components/IssueModal/IssueOverview';

const IssueExplorer = ({
  projectId,
  issueId,
}: {
  projectId: string;
  issueId?: string | undefined;
}) => {
  const getProjectInfo = useQuery(GET_PROJECT_INFO, {
    skip: !projectId,
    variables: {
      input: { id: `${projectId}` },
      issueInput: { sortBy: [{ field: 'id', order: 'DESC' }] },
    },
  });

  return (
    <>
      <div className='flex max-h-main-content flex-row pb-5'>
        <div className='basis-1/5'>
          <div className='mb-4 mr-8 max-h-main-content overflow-y-scroll bg-gray-200 bg-opacity-50 p-2'>
            {getProjectInfo?.data?.project?.issues?.map((issue: Issue) => (
              <IssueCard
                key={issue.id}
                projectId={projectId}
                id={issue.id}
                projectKey={getProjectInfo?.data?.project?.key}
              />
            ))}
          </div>
        </div>
        <div className='basis-4/5'>
          {issueId && (
            <IssueOverview
              issueId={issueId}
              projectId={projectId}
              projectKey={getProjectInfo?.data?.project?.key ?? ''}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default IssueExplorer;

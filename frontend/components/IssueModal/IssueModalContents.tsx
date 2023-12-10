'use client';
import IssueOverview from '@/components/IssueModal/IssueOverview';

const IssueModalContents = ({
  issueId,
  projectId,
  projectKey,
  boardId,
}: {
  issueId: string;
  projectId: string;
  projectKey: string;
  boardId?: string;
}) => {
  return (
    <div className='ml-auto mr-auto flex max-h-issue-modal max-w-issue-modal overflow-visible overflow-y-auto'>
      <div className='flex w-[1280px] flex-col'>
        <IssueOverview
          issueId={issueId}
          projectId={projectId}
          projectKey={projectKey}
        />
      </div>
    </div>
  );
};

export default IssueModalContents;

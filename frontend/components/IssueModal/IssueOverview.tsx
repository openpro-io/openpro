'use client';

import IssueHeader from '@/components/IssueModal/IssueHeader';
import { Panel, PanelGroup } from 'react-resizable-panels';
import IssueTitle from '@/components/IssueModal/IssueTitle';
import IssueDescription from '@/components/IssueModal/IssueDescription';
import IssueComments from '@/components/IssueModal/IssueComments';
import ResizeHandle from '@/components/Panels/ResizeHandle';
import IssueStatusDropdown from '@/components/IssueModal/IssueStatusDropdown';
import IssueDetails from '@/components/IssueModal/IssueDetails';

const defaultLayout = [70, 30];

const IssueOverview = ({
  issueId,
  projectId,
  projectKey,
}: {
  issueId: string;
  projectId: string;
  projectKey: string;
}) => {
  return (
    <>
      <div className='pb-2'>
        <IssueHeader projectKey={projectKey} issueId={issueId} />
      </div>
      <div className='flex flex-1 pl-2'>
        {/* @ts-ignore */}
        <div className='flex flex-1 space-x-1' style={{ width: 100 }}>
          <PanelGroup
            direction='horizontal'
            autoSaveId='react-resizable-panels-issue-modal'
            style={{ overflow: 'visible' }}
            // onLayout={onLayout}
          >
            <Panel defaultSize={defaultLayout[0]} order={1} id='left-panel'>
              <div className='w-500 flex flex-1 flex-col pr-3'>
                <div>
                  <IssueTitle issueId={issueId} />
                </div>
                <div>
                  <IssueDescription issueId={issueId} />
                </div>
                <div className='pt-5'>
                  <IssueComments issueId={issueId} />
                </div>
              </div>
            </Panel>

            {/* Handlebar section */}
            {/*<PanelResizeHandle className='z-10 mx-2 w-0.5 hover:bg-blue-800' />*/}

            <ResizeHandle id='modal-resize-handle' />

            {/* Right section */}
            <Panel
              defaultSize={defaultLayout[1]}
              order={2}
              id='right-panel'
              style={{ overflow: 'visible' }}
            >
              <div className='flex flex-1 pl-3'>
                <div className='flex-1'>
                  <div className='flex flex-col'>
                    {/* Top component on the right */}
                    <div className='flex flex-row'>
                      <div>
                        <IssueStatusDropdown
                          projectId={projectId}
                          issueId={issueId}
                        />
                      </div>
                      {/*<div>test2</div>*/}
                    </div>
                    {/* 2nd to top component on the right*/}
                    <IssueDetails projectId={projectId} issueId={issueId} />
                  </div>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </>
  );
};

export default IssueOverview;

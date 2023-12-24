'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ProjectList from '@/components/ProjectList';
import FullWidthSlideOver from '@/components/SlideOver/FullWidthSlideOver';
import CreateProjectSelection from '@/components/CreateProjectSelection';
import { useMutation } from '@apollo/client';
import { CreateProject } from '@/constants/types';
import {
  CREATE_PROJECT_MUTATION,
  GET_PROJECTS,
} from '@/gql/gql-queries-mutations';
import { Button } from '@/components/Button';

const Dashboard: React.FC = () => {
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION);

  const createProjectTypeSelection = (createProjectData: CreateProject) => {
    if (!createProjectData) return;

    setCreateProjectModalOpen(false);

    createProject({
      variables: {
        input: {
          name: createProjectData.name,
          key: createProjectData.key,
          visibility: createProjectData.visibility,
          description: '',
          boardName: 'Default',
          boardStyle: createProjectData.projectTypeName.toUpperCase(),
        },
      },
      refetchQueries: [GET_PROJECTS],
    });
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            name: 'Dashboard',
            href: '/dashboard',
            current: true,
          },
        ]}
      />

      <div className='md:flex md:items-center md:justify-between'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight'>
            Projects
          </h2>
        </div>
        <div className='mt-4 flex md:ml-4 md:mt-0'>
          <Button
            onClick={() => {
              setCreateProjectModalOpen(true);
            }}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/*  @ts-ignore */}
      <FullWidthSlideOver
        open={createProjectModalOpen}
        setOpen={setCreateProjectModalOpen}
        panelTitle={'Select a project style'}
      >
        <div className='flex justify-center'>
          <div className='w-1/3'>
            <CreateProjectSelection
              onSelectCallback={createProjectTypeSelection}
            />
          </div>
        </div>
      </FullWidthSlideOver>

      <div className='pt-5'>
        <ProjectList />
      </div>
    </>
  );
};

export default Dashboard;

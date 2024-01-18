import { useSuspenseQuery } from '@apollo/client';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { sample } from 'lodash';
import type { Route } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { GetProjectsQuery, Project } from '@/gql/__generated__/graphql';
import { GET_PROJECTS } from '@/gql/gql-queries-mutations';
import { classNames } from '@/services/utils';

const baseColors = [
  'bg-pink-600',
  'bg-purple-600',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-gray-500',
];

let colors = [...baseColors];

// TODO: This is a hacky way to get a unique color for each project.
//  Lets use a backend service to get a unique color for each project
const getUniqueColor = () => {
  if (colors.length === 0) {
    colors = [...baseColors];
  }
  const randomColor = sample(colors);
  colors = colors.filter((c) => c !== randomColor);
  return randomColor;
};

const formatProjectCard = (project: Project) => {
  const { id, name, key: initials, issueCount, boards } = project;
  const boardId = boards?.[0]?.id ?? 1;

  return {
    id,
    name,
    initials,
    href: `projects/${id}/boards/${boardId}`,
    issueCount,
    bgColor: getUniqueColor(),
  };
};

const LoadingProjectTile = () => {
  return (
    <ul className='mt-3 grid h-14 animate-pulse grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'>
      <li className='col-span-1 flex rounded-md shadow-sm'>
        <div
          className={classNames(
            'bg-gray-200',
            'fontu -medium flex w-20 flex-shrink-0 items-center justify-center rounded-l-md text-sm text-primary'
          )}
        ></div>
        <div className='flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-primary bg-surface'>
          <div className='flex-1 truncate px-4 py-2 text-sm'>
            <Link
              href={'#'}
              className='font-medium text-primary hover:text-primary/80'
            ></Link>
            <p className='text-primary'></p>
          </div>
          <div className='flex-shrink-0 pr-2'>
            <button
              type='button'
              className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface bg-transparent text-primary hover:text-primary/80 focus:outline-none'
            >
              <span className='sr-only'>Open options</span>
              <EllipsisVerticalIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </li>
    </ul>
  );
};

const ProjectTiles = () => {
  const { data } = useSuspenseQuery<GetProjectsQuery>(GET_PROJECTS);

  // @ts-ignore
  const projects = data?.projects ? data.projects.map(formatProjectCard) : [];

  return (
    <ul className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-2'>
      {projects.length > 0 &&
        projects.map((project) => (
          <li key={project.id} className='col-span-1 flex rounded-md shadow-sm'>
            <div
              className={classNames(
                project.bgColor,
                'flex w-20 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
              )}
            >
              {project.initials}
            </div>
            <div className='flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-primary/20 bg-surface'>
              <div className='flex-1 truncate px-4 py-2 text-sm'>
                <Link
                  href={project.href as Route}
                  className='font-medium text-primary hover:text-primary/70'
                >
                  {project.name}
                </Link>
                <p className='text-primary'>{project.issueCount} Issues</p>
              </div>
              <div className='flex-shrink-0 pr-2'>
                <button
                  type='button'
                  className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface bg-transparent text-primary hover:text-primary/70 focus:outline-none'
                >
                  <span className='sr-only'>Open options</span>
                  <EllipsisVerticalIcon
                    className='h-5 w-5'
                    aria-hidden='true'
                  />
                </button>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export const RecentProjectsCards = () => {
  return (
    <div>
      <Suspense fallback={<LoadingProjectTile />}>
        <ProjectTiles />
      </Suspense>
    </div>
  );
};

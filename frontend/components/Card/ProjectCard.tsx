import React from 'react';

// @ts-ignore
export const ProjectCard = ({ project }) => {
  // https://admin.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10401?size=xxlarge
  return (
    <div className='w-[400px]'>
      <div className='hover:bg-primary-light hover:text-primary-main hover:outline-primary-main dark:bg-dark-200 dark:hover:text-primary-main-dark dark:hover:outline-primary-main-dark group flex rounded shadow-md outline outline-2 outline-transparent duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-lg'>
        <img
          src='https://admin.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10400?size=xxlarge'
          alt='Project'
          width='90px'
          height='104px'
          className='h-auto w-[90px] rounded-l object-cover'
        />
        <div className='flex flex-col gap-1 px-3 pb-6 pt-2'>
          <h2 className='text-lg'>{project.name}</h2>
          <h3 className=''>Software project</h3>
        </div>
      </div>
      <button
        type='button'
        aria-haspopup='dialog'
        aria-expanded='false'
        aria-controls='radix-:r9:'
        data-state='closed'
        className='text-font-light dark:text-font-light-dark mt-1 flex cursor-not-allowed items-center gap-1 border-none text-sm text-opacity-50 dark:text-opacity-40'
        aria-label='Open delete issue dialog'
        title='Cannot delete default project'
        disabled
      >
        <svg
          stroke='currentColor'
          fill='currentColor'
          strokeWidth='0'
          viewBox='0 0 24 24'
          height='15'
          width='15'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path fill='none' d='M0 0h24v24H0V0z'></path>
          <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z'></path>
        </svg>
        Delete project
      </button>
    </div>
  );
};

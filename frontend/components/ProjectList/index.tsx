import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '@/gql/gql-queries-mutations';
import { GetProjectsQuery, Project } from '@/gql/__generated__/graphql';

const cols = ['ID', 'Name', 'Key', 'Board Style', 'Description', ''];

// TODO: Make this its own component?
const ProjectOptionsDropdown = () => {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='text-md inline-flex w-full justify-center gap-x-1.5 px-2 py-1 font-semibold ring-gray-300 hover:bg-neutral-pressed'>
          <EllipsisHorizontalIcon
            className='h-8 w-8'
            aria-hidden='true'
            id='ProjectOptionsDropdown'
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-999 mt-2 w-fit origin-top-right rounded-md bg-neutral shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={'block px-4 py-2 text-sm hover:bg-neutral-pressed'}
                >
                  Project settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href='#'
                  className={'block px-4 py-2 text-sm hover:bg-neutral-pressed'}
                >
                  Delete
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

type PaginationComponentProps = {
  handlePrev: () => void;
  handleNext: () => void;
  currentPage: number;
  handlePageChange: (page: number) => void;
  pages: number[];
  numPages: number;
};

const PaginationComponent = ({
  handlePrev,
  handleNext,
  currentPage,
  handlePageChange,
  pages,
  numPages,
}: PaginationComponentProps) => {
  return (
    <nav className='flex items-center justify-between border-gray-200 px-4 py-3 sm:px-0'>
      <div className='-mt-px flex w-0 flex-1'>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className='relative inline-flex items-center border-t-2 border-transparent py-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
        >
          <ArrowLongLeftIcon
            className='mr-3 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
          Previous
        </button>
      </div>
      <div className='hidden md:-mt-px md:flex'>
        {pages.map((number) => (
          <button
            key={number}
            className={`relative inline-flex items-center border-t-2 px-4 py-4 text-sm font-medium ${
              currentPage === number
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className='-mt-px flex w-0 flex-1 justify-end'>
        <button
          onClick={handleNext}
          disabled={currentPage === numPages}
          className='relative inline-flex items-center border-t-2 border-transparent py-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
        >
          Next
          <ArrowLongRightIcon
            className='ml-3 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </button>
      </div>
    </nav>
  );
};

const ProjectList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data } = useQuery<GetProjectsQuery>(GET_PROJECTS);
  const { push } = useRouter();

  const projects: Project[] = (data?.projects as Project[]) || [];

  // --- BEGIN PAGINATION STUFF
  // Calculate number of pages
  const numPages = Math.ceil(projects?.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  const handlePrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = projects?.slice(startIndex, endIndex);

  const pages = Array.from({ length: numPages }, (_, index) => index + 1);
  // --- END PAGINATION STUFF

  return (
    <div className='flex flex-col'>
      <div className='sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
          {/* TODO: I added overflow-y-scroll here but lets do pagination in a table instead */}
          {/* TODO: the elipsis dropdown css is broken */}
          <div className='overflow-y-auto pb-25'>
            <table className='min-w-full text-left text-sm'>
              <thead className='border-b font-medium'>
                <tr>
                  {cols.map((col) => (
                    <th key={col} scope='col' className='px-3 py-2'>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='border-b'>
                {itemsOnPage?.map((project) => (
                  <tr
                    onClick={(e) => {
                      // @ts-ignore
                      if (e?.target?.id !== 'ProjectOptionsDropdown') {
                        push(
                          `/projects/${project.id}/boards/${project.boards?.[0]?.id}`
                        );
                      }
                    }}
                    key={project.id}
                    className='transition duration-300 ease-in-out hover:cursor-pointer hover:bg-neutral-hovered/5'
                  >
                    <td className='whitespace-nowrap px-3 py-1 font-medium'>
                      {project.id}
                    </td>
                    <td className='whitespace-nowrap px-3 py-1'>
                      {project?.name}
                    </td>
                    <td className='whitespace-nowrap px-3 py-1'>
                      {project?.key}
                    </td>
                    <td className='whitespace-nowrap px-3 py-1'>
                      {project?.boards?.[0]
                        ? project?.boards?.[0].style
                        : 'Kanban'}
                    </td>
                    <td className='whitespace-nowrap px-3 py-1'>
                      {project?.description}
                    </td>
                    <td className='whitespace-nowrap px-3 py-1'>
                      <ProjectOptionsDropdown />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <PaginationComponent
              handlePrev={handlePrev}
              handleNext={handleNext}
              currentPage={currentPage}
              pages={pages}
              numPages={numPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import type { Route } from 'next';

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
];

type PathType = {
  name: string;
  href: string;
  current?: boolean;
};

export default function Breadcrumb({ paths }: { paths: PathType[] }) {
  return (
    <nav className='flex pb-4' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-3'>
        <li>
          <div>
            <Link
              href='/dashboard'
              className='text-gray-400 hover:text-gray-500'
            >
              <HomeIcon className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
              <span className='sr-only'>Home</span>
            </Link>
          </div>
        </li>
        {paths.map((page) => (
          <li key={page.name}>
            <div className='flex items-center'>
              <ChevronRightIcon
                className='h-5 w-5 flex-shrink-0 text-gray-400'
                aria-hidden='true'
              />
              <Link
                href={page.href as Route}
                className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

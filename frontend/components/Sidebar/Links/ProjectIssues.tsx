import SidebarLinkGroup from '@/components/Sidebar/SidebarLinkGroup';
import React from 'react';
import Link from 'next/link';
import { classNames } from '@/services/utils';
import { REGEX_PROJECT_ISSUES } from '@/components/Sidebar/constants';
import { useParams, usePathname } from 'next/navigation';

export default function ProjectIssues({}: {}) {
  const pathname = usePathname();
  const urlParams = useParams();
  const projectId = urlParams?.projectId;

  const isActive = REGEX_PROJECT_ISSUES.test(pathname);

  return (
    <SidebarLinkGroup activeCondition={isActive}>
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href={`/projects/${projectId}/issues`}
              className={classNames(
                'text-link hover:bg-link-active group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out',
                isActive && 'bg-link-active text-link-active'
              )}
            >
              <span aria-hidden='true'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  role='presentation'
                >
                  <g fill='currentColor' fillRule='evenodd'>
                    <path
                      d='M5 12.991c0 .007 14.005.009 14.005.009C18.999 13 19 5.009 19 5.009 19 5.002 4.995 5 4.995 5 5.001 5 5 12.991 5 12.991zM3 5.01C3 3.899 3.893 3 4.995 3h14.01C20.107 3 21 3.902 21 5.009v7.982c0 1.11-.893 2.009-1.995 2.009H4.995A2.004 2.004 0 013 12.991V5.01zM19 19c-.005 1.105-.9 2-2.006 2H7.006A2.009 2.009 0 015 19h14zm1-3a2.002 2.002 0 01-1.994 2H5.994A2.003 2.003 0 014 16h16z'
                      fillRule='nonzero'
                    ></path>
                    <path d='M10.674 11.331c.36.36.941.36 1.3 0l2.758-2.763a.92.92 0 00-1.301-1.298l-2.108 2.11-.755-.754a.92.92 0 00-1.3 1.3l1.406 1.405z'></path>
                  </g>
                </svg>
              </span>
              Issues
            </Link>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  );
}

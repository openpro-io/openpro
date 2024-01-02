'use client';

import { useQuery } from '@apollo/client';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import ProjectIssues from '@/components/Sidebar/Links/ProjectIssues';
import ProjectContainerSection from '@/components/Sidebar/ProjectContainerSection';
import {
  REGEX_PROJECT_BOARD,
  REGEX_PROJECT_BOARD_BACKLOG,
  REGEX_PROJECT_ISSUES,
} from '@/components/Sidebar/constants';
import { GET_BOARD_INFO } from '@/gql/gql-queries-mutations';
import useColorMode from '@/hooks/useColorMode';
import useLocalStorage from '@/hooks/useLocalStorage';
import { classNames } from '@/services/utils';

import SidebarLinkGroup from './SidebarLinkGroup';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const urlParams = useParams();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const boardId = urlParams?.boardId;
  let storedSidebarExpanded = 'true';
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const getBoardInfo = useQuery(GET_BOARD_INFO, {
    skip: !boardId,
    variables: { input: { id: boardId } },
  });

  const projectId = urlParams?.projectId;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`bg-bkg absolute left-0 top-0 z-9999 flex h-screen w-full flex-col text-primary duration-100 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className='flex items-center justify-between gap-2 px-10 py-5.5 lg:py-6.5'>
        <Link href='/'>
          {/* TODO: This is the logo */}
          <svg
            className='h-13 w-50 fill-current text-zinc-800 dark:text-white'
            viewBox='0 0 756 203'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M106.003 200C161.232 200 206.003 155.228 206.003 100C206.003 44.7715 161.232 0 106.003 0C50.7749 0 6.00342 44.7715 6.00342 100C6.00342 155.228 50.7749 200 106.003 200ZM55.0003 148C85.3759 178.376 134.625 178.376 165 148C195.376 117.624 195.376 68.3756 165 38C134.625 7.62433 85.3759 7.62433 55.0003 38C24.6246 68.3756 24.6246 117.624 55.0003 148Z'
            />
            <path
              d='M170.228 142.229C139.676 167.262 115.019 146.019 86.5 117.5C57.9806 88.9806 35.7376 63.3242 60.7715 32.7716C58.7829 34.4009 56.8562 36.1438 55 38.0001C24.6243 68.3757 24.6243 117.624 55 148C85.3757 178.376 134.624 178.376 165 148C166.856 146.144 168.599 144.217 170.228 142.229Z'
              fill='url(#paint0_linear_1_30)'
            />
            <path d='M721.614 156.056C714.958 156.056 709.102 154.616 704.046 151.736C699.054 148.792 695.15 144.696 692.334 139.448C689.582 134.2 688.206 128.088 688.206 121.112C688.206 115.8 688.974 111.032 690.51 106.808C692.11 102.52 694.382 98.872 697.326 95.864C700.27 92.792 703.79 90.424 707.886 88.76C712.046 87.096 716.622 86.264 721.614 86.264C728.398 86.264 734.286 87.704 739.278 90.584C744.27 93.464 748.142 97.528 750.894 102.776C753.71 107.96 755.118 114.04 755.118 121.016C755.118 126.328 754.318 131.128 752.718 135.416C751.118 139.704 748.846 143.384 745.902 146.456C742.958 149.528 739.438 151.896 735.342 153.56C731.246 155.224 726.67 156.056 721.614 156.056ZM721.614 143.384C725.39 143.384 728.59 142.52 731.214 140.792C733.902 139 735.95 136.44 737.358 133.112C738.83 129.72 739.566 125.72 739.566 121.112C739.566 114.072 737.998 108.632 734.862 104.792C731.726 100.888 727.31 98.936 721.614 98.936C717.902 98.936 714.702 99.8 712.014 101.528C709.326 103.256 707.278 105.784 705.87 109.112C704.462 112.44 703.758 116.44 703.758 121.112C703.758 128.088 705.326 133.56 708.462 137.528C711.598 141.432 715.982 143.384 721.614 143.384Z' />
            <path d='M631.335 155.864C628.903 155.864 627.047 155.192 625.767 153.848C624.487 152.504 623.847 150.616 623.847 148.184V94.9039C623.847 92.4079 624.487 90.5199 625.767 89.2399C627.111 87.9599 628.999 87.3199 631.431 87.3199H654.759C662.311 87.3199 668.135 89.1439 672.231 92.792C676.327 96.4399 678.375 101.528 678.375 108.056C678.375 112.28 677.447 115.928 675.591 119C673.735 122.072 671.047 124.44 667.527 126.104C664.071 127.768 659.815 128.6 654.759 128.6L655.527 126.968H659.463C662.151 126.968 664.487 127.64 666.471 128.984C668.519 130.264 670.279 132.248 671.751 134.936L677.703 145.976C678.599 147.576 679.015 149.144 678.951 150.68C678.887 152.216 678.311 153.464 677.223 154.424C676.135 155.384 674.535 155.864 672.423 155.864C670.311 155.864 668.583 155.416 667.239 154.52C665.959 153.624 664.807 152.248 663.783 150.392L654.567 133.4C653.607 131.608 652.423 130.392 651.015 129.752C649.671 129.112 648.007 128.792 646.023 128.792H638.727V148.184C638.727 150.616 638.087 152.504 636.807 153.848C635.591 155.192 633.767 155.864 631.335 155.864ZM638.727 118.04H652.071C656.039 118.04 659.015 117.24 660.999 115.64C663.047 114.04 664.071 111.64 664.071 108.44C664.071 105.304 663.047 102.936 660.999 101.336C659.015 99.7359 656.039 98.9359 652.071 98.9359H638.727V118.04Z' />
            <path d='M551.103 156.152C547.861 156.152 545.386 155.256 543.679 153.464C541.973 151.672 541.119 149.155 541.119 145.912V74.872C541.119 71.544 541.973 69.0267 543.679 67.32C545.471 65.6133 547.989 64.76 551.231 64.76H582.335C592.405 64.76 600.17 67.32 605.631 72.44C611.093 77.4747 613.823 84.5147 613.823 93.56C613.823 102.605 611.093 109.688 605.631 114.808C600.17 119.928 592.405 122.488 582.335 122.488H560.959V145.912C560.959 149.155 560.106 151.672 558.399 153.464C556.778 155.256 554.346 156.152 551.103 156.152ZM560.959 107.128H579.007C584.127 107.128 588.01 105.976 590.655 103.672C593.386 101.368 594.751 97.9973 594.751 93.56C594.751 89.1227 593.386 85.7947 590.655 83.576C588.01 81.3573 584.127 80.248 579.007 80.248H560.959V107.128Z' />
            <path d='M473.478 155.864C471.238 155.864 469.51 155.256 468.294 154.04C467.142 152.76 466.566 150.968 466.566 148.664V93.9441C466.566 91.5121 467.142 89.6561 468.294 88.3761C469.51 87.0961 471.11 86.4561 473.094 86.4561C474.822 86.4561 476.134 86.8081 477.03 87.5121C477.99 88.1521 479.078 89.2401 480.294 90.7761L513.99 133.688H511.398V93.5601C511.398 91.3201 511.974 89.5921 513.126 88.3761C514.342 87.0961 516.07 86.4561 518.31 86.4561C520.55 86.4561 522.246 87.0961 523.398 88.3761C524.614 89.5921 525.222 91.3201 525.222 93.5601V148.952C525.222 151.064 524.678 152.76 523.59 154.04C522.502 155.256 521.03 155.864 519.174 155.864C517.382 155.864 515.942 155.512 514.854 154.808C513.83 154.104 512.71 152.984 511.494 151.448L477.894 108.536H480.39V148.664C480.39 150.968 479.814 152.76 478.662 154.04C477.51 155.256 475.782 155.864 473.478 155.864Z' />
            <path d='M416.217 155C413.721 155 411.801 154.328 410.457 152.984C409.113 151.64 408.441 149.72 408.441 147.224V95.096C408.441 92.5999 409.113 90.6799 410.457 89.3359C411.801 87.9919 413.721 87.3199 416.217 87.3199H449.721C451.641 87.3199 453.081 87.8319 454.041 88.8559C455.065 89.8159 455.577 91.2239 455.577 93.0799C455.577 94.9999 455.065 96.4719 454.041 97.4959C453.081 98.4559 451.641 98.9359 449.721 98.9359H422.649V114.776H447.513C449.497 114.776 450.969 115.288 451.929 116.312C452.953 117.272 453.465 118.712 453.465 120.632C453.465 122.552 452.953 124.024 451.929 125.048C450.969 126.008 449.497 126.488 447.513 126.488H422.649V143.384H449.721C451.641 143.384 453.081 143.896 454.041 144.92C455.065 145.88 455.577 147.288 455.577 149.144C455.577 151.064 455.065 152.536 454.041 153.56C453.081 154.52 451.641 155 449.721 155H416.217Z' />
            <path d='M352.179 155.864C349.747 155.864 347.891 155.192 346.611 153.848C345.331 152.504 344.691 150.616 344.691 148.184V94.9039C344.691 92.4079 345.331 90.5199 346.611 89.2399C347.955 87.9599 349.843 87.3199 352.275 87.3199H375.603C383.155 87.3199 388.979 89.2399 393.075 93.0799C397.171 96.8559 399.219 102.136 399.219 108.92C399.219 115.704 397.171 121.016 393.075 124.856C388.979 128.696 383.155 130.616 375.603 130.616H359.571V148.184C359.571 150.616 358.931 152.504 357.651 153.848C356.435 155.192 354.611 155.864 352.179 155.864ZM359.571 119.096H373.107C376.947 119.096 379.859 118.232 381.843 116.504C383.891 114.776 384.915 112.248 384.915 108.92C384.915 105.592 383.891 103.096 381.843 101.432C379.859 99.7679 376.947 98.9359 373.107 98.9359H359.571V119.096Z' />
            <path d='M286.944 156.408C278.069 156.408 270.261 154.488 263.52 150.648C256.864 146.723 251.659 141.261 247.904 134.264C244.235 127.267 242.4 119.117 242.4 109.816C242.4 102.733 243.424 96.3761 245.472 90.744C247.605 85.0267 250.635 80.1627 254.56 76.152C258.485 72.056 263.179 68.8987 268.64 66.68C274.187 64.4614 280.288 63.3521 286.944 63.3521C295.989 63.3521 303.84 65.2721 310.496 69.1121C317.152 72.952 322.315 78.3707 325.984 85.368C329.739 92.28 331.616 100.387 331.616 109.688C331.616 116.771 330.549 123.171 328.416 128.888C326.283 134.605 323.253 139.512 319.328 143.608C315.403 147.704 310.709 150.861 305.248 153.08C299.787 155.299 293.685 156.408 286.944 156.408ZM286.944 139.512C291.979 139.512 296.245 138.36 299.744 136.056C303.328 133.667 306.059 130.253 307.936 125.816C309.899 121.293 310.88 115.96 310.88 109.816C310.88 100.429 308.789 93.1761 304.608 88.0561C300.427 82.8507 294.539 80.248 286.944 80.248C281.995 80.248 277.728 81.4 274.144 83.704C270.56 86.008 267.829 89.3787 265.952 93.816C264.075 98.2534 263.136 103.587 263.136 109.816C263.136 119.117 265.227 126.413 269.408 131.704C273.589 136.909 279.435 139.512 286.944 139.512Z' />
            <defs>
              <linearGradient
                id='paint0_linear_1_30'
                x1='55.5528'
                y1='49.4423'
                x2='147.335'
                y2='167.671'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#64BCAC' />
                <stop offset='1' stopColor='#EEEEEE' />
              </linearGradient>
            </defs>
          </svg>
        </Link>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        {/* <!-- Sidebar Menu --> */}
        <nav className='mt-1 px-1 py-1 lg:mt-3 lg:px-6'>
          <ProjectContainerSection />

          {/* <!-- Menu Group --> */}
          <div>
            {/* <!--  This is the project view sidebar--> */}
            {pathname.includes('projects') && pathname !== '/projects' && (
              <>
                <ul className='mb-6 flex flex-col gap-0.5'>
                  {/* <!-- Menu Item project board --> */}
                  <SidebarLinkGroup
                    activeCondition={REGEX_PROJECT_BOARD.test(pathname)}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href={`/projects/${projectId}/boards/1`}
                            className={classNames(
                              'group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-link-active',
                              REGEX_PROJECT_BOARD.test(pathname)
                                ? 'border-l-4 bg-link-active text-link-active'
                                : 'text-link'
                            )}
                          >
                            {/* TODO: make this a component */}
                            <svg
                              stroke='currentColor'
                              fill='none'
                              strokeWidth='0'
                              viewBox='0 0 24 24'
                              height='24'
                              width='24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2'
                              ></path>
                            </svg>
                            Board
                          </Link>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  {/* <!-- Menu Item project board --> */}

                  {/* <!-- Menu Item Backlog --> */}
                  <SidebarLinkGroup
                    hidden={!getBoardInfo?.data?.board?.backlogEnabled}
                    activeCondition={REGEX_PROJECT_BOARD_BACKLOG.test(pathname)}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href={`/projects/${projectId}/boards/${boardId}/backlog`}
                            className={classNames(
                              'group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-link duration-300 ease-in-out hover:bg-link-active',
                              REGEX_PROJECT_BOARD_BACKLOG.test(pathname) &&
                                'bg-link-active text-link-active'
                            )}
                          >
                            <svg
                              stroke='currentColor'
                              fill='currentColor'
                              strokeWidth='0'
                              viewBox='0 0 16 16'
                              height='24'
                              width='24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z'
                              ></path>
                            </svg>
                            Backlog
                          </Link>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  {/* <!-- Menu Item Backlog --> */}

                  {/* <!-- Menu Item Issues --> */}
                  <ProjectIssues />
                  {/* <!-- Menu Item Issues --> */}
                </ul>
              </>
            )}

            {/* <!-- We hide this navbar in non project view --> */}
            {(!pathname.includes('projects') ||
              pathname === '/projects' ||
              pathname === '/dashboard') && (
              <>
                <ul className='mb-6 flex flex-col gap-0.5'>
                  {/* <!-- Menu Item Dashboard --> */}
                  <SidebarLinkGroup
                    activeCondition={
                      // @ts-ignore
                      pathname === '/' || pathname.includes('dashboard')
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href='/dashboard'
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-link duration-300 ease-in-out ${
                              pathname === '/' ||
                              pathname === '/projects' ||
                              (pathname.includes('dashboard') &&
                                'border-l-4 bg-link-active text-link-active')
                            }`}
                            onClick={(e) => {
                              // e.preventDefault();
                              // sidebarExpanded
                              //   ? handleClick()
                              //   : setSidebarExpanded(true);
                            }}
                          >
                            <svg
                              className='fill-current'
                              width='18'
                              height='18'
                              viewBox='0 0 18 18'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z'
                                fill=''
                              />
                              <path
                                d='M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z'
                                fill=''
                              />
                              <path
                                d='M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z'
                                fill=''
                              />
                              <path
                                d='M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z'
                                fill=''
                              />
                            </svg>
                            Projects
                          </Link>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>

                  {/* <!-- Menu Item Dashboard --> */}

                  {/* <!-- Menu Item Users --> */}
                  {/*<SidebarLinkGroup*/}
                  {/*  activeCondition={*/}
                  {/*    // @ts-ignore*/}
                  {/*    pathname === '/users' || pathname.includes('users')*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*  {(handleClick, open) => {*/}
                  {/*    return (*/}
                  {/*      <React.Fragment>*/}
                  {/*        <Link*/}
                  {/*          href={'/users' as Route}*/}
                  {/*          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-link duration-300 ease-in-out hover:bg-blue-link-background dark:hover:bg-meta-4 ${*/}
                  {/*            // @ts-ignore*/}
                  {/*            (pathname === '/' ||*/}
                  {/*              pathname.includes('users')) &&*/}
                  {/*            'bg-blue-link-background text-link-active dark:bg-meta-4'*/}
                  {/*          }`}*/}
                  {/*          onClick={(e) => {*/}
                  {/*            e.preventDefault();*/}
                  {/*            sidebarExpanded*/}
                  {/*              ? handleClick()*/}
                  {/*              : setSidebarExpanded(true);*/}
                  {/*          }}*/}
                  {/*        >*/}
                  {/*          <UserGroupIcon className='h-5 w-5' />*/}
                  {/*          Users*/}
                  {/*        </Link>*/}
                  {/*      </React.Fragment>*/}
                  {/*    );*/}
                  {/*  }}*/}
                  {/*</SidebarLinkGroup>*/}
                  {/* <!-- Menu Item Users --> */}
                </ul>
              </>
            )}
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;

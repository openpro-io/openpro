'use client';
import { RecentProjectsCards } from '@/components/MainPage';

const PageCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='divide-y divide-gray-200 overflow-hidden rounded-lg border border-primary border-opacity-20 bg-surface-overlay shadow-sm'>
      <div className='px-4 py-5 sm:px-6'>{title}</div>
      <div className='px-4 py-5 sm:p-6'>{children}</div>
    </div>
  );
};

export default function Home() {
  return (
    <div className='flex'>
      <div className='basis-1/2'>
        <PageCard title='Recent Projects'>
          <RecentProjectsCards />
        </PageCard>
      </div>
      <div></div>
    </div>
  );
}

import { PanelResizeHandle } from 'react-resizable-panels';
import { RiArrowDropLeftLine } from 'react-icons/ri';
import { classNames } from '@/services/utils';

export default function ResizeHandle({
  sidebarOpen,
  setSidebarOpen,
  id,
}: {
  id?: string;
  setSidebarOpen?: any;
  sidebarOpen?: boolean;
}) {
  return (
    <PanelResizeHandle className='resize-handle-outer' id={id}>
      <div className='resize-handle-inner'>
        <div className='absolute -left-[3px] h-full w-[3px] bg-surface-overlay-hovered opacity-80' />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={classNames(
            'absolute -left-[12px] mt-6 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full border-none bg-surface-overlay shadow-[0_1px_5px_-1px_rgba(0,0,0,0.3)] transition-transform delay-150 duration-200 ease-in hover:text-primary',
            !sidebarOpen && 'rotate-180'
          )}
          aria-label='Toggle sidebar'
        >
          <RiArrowDropLeftLine className='h-10 w-10' />
        </button>
      </div>
    </PanelResizeHandle>
  );
}

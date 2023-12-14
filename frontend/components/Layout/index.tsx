'use client';
import { CommandPalette } from '@/components/CommandPalette';
import Notifications from '@/components/Notifications';
import { Panel, PanelGroup } from 'react-resizable-panels';
import Sidebar from '@/components/Sidebar';
import ResizeHandle from '@/components/Panels/ResizeHandle';
import Header from '@/components/Header';
import { useEffect, useRef, useState } from 'react';

import '../../globals.css';
import '../../satoshi.css';
import Loader from '@/components/common/Loader';

import { signIn, signOut, useSession } from 'next-auth/react';
import { PUBLIC_DEFAULT_LOGIN_PROVIDER } from '@/services/config';
import useAuthenticatedSocket from '@/hooks/useAuthenticatedSocket';
import socketMsgHandler from '@/services/socket-handlers';

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('onUnauthenticated');
      return signIn(PUBLIC_DEFAULT_LOGIN_PROVIDER, {
        callbackUrl: '/dashboard',
      });
    },
  });

  // Signout if accessTokenError
  useEffect(() => {
    if (session?.accessTokenError) {
      signOut();
    }
  }, [session]);

  const authorized = status === 'authenticated';

  if (status === 'loading') {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        <Loader />
      </div>
    );
  }

  return <div className=''>{authorized && <>{children}</>}</div>;
};

const DEFAULT_LEFT_PANEL_MIN_SIZE = 1;
const DEFAULT_LEFT_PANEL_DEFAULT_SIZE = 10;
const DEFAULT_LEFT_PANEL_MAX_SIZE = 20;

// TODO: Lets make this way cleaner
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const leftPanel = useRef(null);
  const { socket, connected, error } = useAuthenticatedSocket();

  // This is our global handler for websocket messages
  useEffect(() => {
    if (connected) {
      socket.on('message', socketMsgHandler);
    }
  }, [connected]);

  useEffect(() => {
    if (sidebarOpen) {
      // @ts-ignore
      leftPanel.current?.resize(DEFAULT_LEFT_PANEL_DEFAULT_SIZE);
    } else {
      // @ts-ignore
      leftPanel.current?.resize(DEFAULT_LEFT_PANEL_MIN_SIZE);
    }
  }, [sidebarOpen]);

  // @ts-ignore
  return (
    <div className='flex bg-surface text-primary'>
      <CommandPalette />
      <Notifications />
      <PanelGroup
        autoSaveId='react-resizable-panels-main-layout'
        direction='horizontal'
        // onLayout={onLayout}
      >
        {/* @ts-ignore */}
        <Panel
          minSize={DEFAULT_LEFT_PANEL_MIN_SIZE}
          defaultSize={DEFAULT_LEFT_PANEL_DEFAULT_SIZE}
          maxSize={DEFAULT_LEFT_PANEL_MAX_SIZE}
          order={1}
          ref={leftPanel}
        >
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </Panel>
        {/*<PanelResizeHandle className='z-10 -ml-1 w-1 hover:bg-blue-800' />*/}
        <ResizeHandle
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <Panel defaultSize={80} order={2}>
          {/* <!-- ===== Content Area Start ===== --> */}
          <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className='mx-auto p-4 md:p-4 2xl:p-5'>{children}</div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </Panel>
      </PanelGroup>
    </div>
  );
}

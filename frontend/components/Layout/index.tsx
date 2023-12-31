'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ReadyState } from 'react-use-websocket';

import { CommandPalette } from '@/components/CommandPalette';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import ResizeHandle from '@/components/Panels/ResizeHandle';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/common/Loader';
import useAuthenticatedSocket from '@/hooks/useAuthenticatedSocket';
import useWsAuthenticatedSocket from '@/hooks/useWsAuthenticatedSocket';
import { PUBLIC_DEFAULT_LOGIN_PROVIDER } from '@/services/config';
import socketMsgHandler from '@/services/socket-handlers';

import '../../globals.css';
import '../../satoshi.css';

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

const DEFAULT_LEFT_PANEL_MIN_SIZE = 17;
const DEFAULT_LEFT_PANEL_DEFAULT_SIZE = 17;
const DEFAULT_LEFT_PANEL_MAX_SIZE = 30;

// TODO: Lets make this way cleaner
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const leftPanel = useRef(null);
  const { socket, connected, error } = useAuthenticatedSocket();
  const { sendMessage, lastMessage, readyState } = useWsAuthenticatedSocket();

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // This is our global handler for websocket messages
  useEffect(() => {
    if (connected) {
      socket.on('message', socketMsgHandler);
    }
  }, [connected]);

  useEffect(() => {
    console.log('readyState', connectionStatus);
    // if (readyState === ReadyState.OPEN) {
    //   console.log('pinging');
    //   sendMessage('ping');
    // }
  }, [connectionStatus]);

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

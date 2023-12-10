'use client';

// import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard/Dashboard';
// import { useEffect } from 'react';

export default function Home() {
  // const { data: session } = useSession();
  // const { push } = useRouter();

  // useEffect(() => {
  //   // If no session exists, display access denied message
  //   if (!session) {
  //     // TODO: login page
  //     push('/');
  //   }
  // }, [session]);

  return (
    <>
      <Dashboard />
    </>
  );
}

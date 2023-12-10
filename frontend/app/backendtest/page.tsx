'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NEXT_PUBLIC_API_URL } from '@/services/config';

export default function Backendtest() {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If no session exists, display access denied message
    if (!session && status !== 'loading') {
      // TODO: login page
      push('/');
      return;
    }

    // console.log({ session });

    // @ts-ignore
    if (session?.accessTokenError) {
      signOut();
      return;
    }

    // @ts-ignore
    if (session?.accessToken) {
      fetch(`${NEXT_PUBLIC_API_URL}/graphql`, {
        method: 'POST',
        // assign the token as bearer token on your request headers
        headers: {
          // @ts-ignore
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            helloWorld
          }`,
        }),
      })
        .then((res) => {
          setSuccess(true);
        })
        .catch((error) => {
          console.log({ error });
        });
    }
  }, [session]);

  return <>Success: {success ? 'true' : 'false'}</>;
}

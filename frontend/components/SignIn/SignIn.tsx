'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
// @ts-ignore
import { createRegistrationUrl } from '@/services/utils';
import type { Route } from 'next';
import { PUBLIC_DEFAULT_LOGIN_PROVIDER } from '@/services/config';

const SignIn: React.FC = () => {
  const [registrationUrl, setRegistrationUrl] = React.useState('');

  useEffect(() => {
    setRegistrationUrl(
      createRegistrationUrl(
        `${window.location.origin}/auth/signup/callback?type=post_register&redirect_uri=/dashboard`
      )
    );
  }, []);

  return (
    <>
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        <div className='flex flex-wrap items-center'>
          <div className='w-full border-stroke dark:border-strokedark'>
            <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
              <h2 className='sm:text-title-xl2 mb-9 text-2xl font-bold text-black dark:text-white'>
                Sign In
              </h2>

              <form>
                <div className='text-center'>
                  <a
                    className='w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'
                    onClick={() =>
                      signIn(PUBLIC_DEFAULT_LOGIN_PROVIDER, {
                        callbackUrl: '/dashboard',
                      })
                    }
                  >
                    Sign in
                  </a>
                </div>

                <div className='mt-6 text-center'>
                  <p>
                    Don’t have any account?{' '}
                    <Link
                      href={registrationUrl as Route}
                      className='text-primary'
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

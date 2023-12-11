'use client';

import { Inter } from 'next/font/google';
import '../globals.css';
import NextAuthProvider from '@/app/context/NextAuthProvider';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/services/apollo-client';
import MainLayout, { ProtectedLayout } from '@/components/Layout';
import { PublicEnvScript } from 'next-runtime-env';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <PublicEnvScript />
        <title>OpenPro</title>
      </head>
      <body id='root' className={inter.className}>
        <ApolloProvider client={apolloClient}>
          <NextAuthProvider>
            <ProtectedLayout>
              <MainLayout>{children}</MainLayout>
            </ProtectedLayout>
          </NextAuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}

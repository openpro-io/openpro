'use client';

import { Inter } from 'next/font/google';
import '../globals.css';
import NextAuthProvider from '@/app/context/NextAuthProvider';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/services/apollo-client';
import MainLayout, { ProtectedLayout } from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
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

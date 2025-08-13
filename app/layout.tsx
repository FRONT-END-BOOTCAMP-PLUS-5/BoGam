import { SessionProvider } from 'next-auth/react';
import './globals.css';
import DetailSlot from './@detail/default';

export default function RootLayout({
  children,
  detail,
}: Readonly<{
  children: React.ReactNode;
  detail: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.svg' />
        <link rel='icon' href='/icons/icon-192x192.svg' />
      </head>
      <body className='font-sans'>
        {/* <Providers> */}
        {children}
        <DetailSlot />
        {detail}
        {/* </Providers> */}
      </body>
    </html>
  );
}

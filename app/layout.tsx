import './globals.css';
// import { Providers } from './providers';
import { ConfirmModal } from './(anon)/_components/common/modal/ConfirmModal';
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
        <ConfirmModal />
        <DetailSlot />
        {detail}
        {/* </Providers> */}
      </body>
    </html>
  );
}

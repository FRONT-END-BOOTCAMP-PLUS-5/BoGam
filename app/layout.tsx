import './globals.css';
import { Providers } from './providers';
import { ConfirmModal } from './(anon)/_components/common/modal/ConfirmModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.svg' />
        <link rel='icon' href='/icons/icon-192x192.svg' />
      </head>
      <body className='font-sans'>
        <Providers>
          {children}
          <ConfirmModal />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/app-header';
import ClientProviders from './client-providers';

export const metadata: Metadata = {
  title: 'NoorRecite',
  description: 'A modern Quran app for reading, listening, and tracking your progress.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <div className="relative flex min-h-dvh flex-col">
          <AppHeader />
          <ClientProviders>
            <main className="flex-1 flex">{children}</main>
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}

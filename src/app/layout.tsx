import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from "@/components/ui/toaster";
import { SplashScreen } from '@/components/layout/splash-screen';

export const metadata: Metadata = {
  title: 'Nexaris Media',
  description: 'Your Central AI Command Hub to Run and Scale Every Business You Own',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='white'></rect><path d='M30 80 L 30 20 L 70 60 L 70 20' stroke='black' stroke-width='15' fill='none' stroke-linejoin='round' stroke-linecap='round'></path></svg>" />
      </head>
      <body>
        <SplashScreen>
          <AppShell>
            {children}
          </AppShell>
        </SplashScreen>
        <Toaster />
      </body>
    </html>
  );
}

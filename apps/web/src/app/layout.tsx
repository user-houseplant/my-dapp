import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My DApp | Web3 Dashboard',
  description: 'A premium Web3 application built with Arbitrum Stylus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={outfit.className}>
        <AnimatedBackground />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
  
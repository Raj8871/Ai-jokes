import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { MotionProvider } from '@/components/providers/motion-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const inter = Inter({ // Use Inter font
  subsets: ['latin'],
  variable: '--font-inter', // Define CSS variable for Inter
});

export const metadata: Metadata = {
  title: 'ShayariSaga',
  description: 'A collection of Jokes and Shayari in Hindi and English',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          inter.variable // Apply Inter font variable
        )}
      >
        <MotionProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}

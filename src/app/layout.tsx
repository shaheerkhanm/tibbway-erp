import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Tibbway Medical Tourism',
  description: 'Manage your medical tourism operations with Tibbway.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

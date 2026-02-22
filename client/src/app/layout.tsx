import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChatApp — Real-Time Chat',
  description: 'A simple real-time chat application built with Next.js and NestJS WebSocket.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

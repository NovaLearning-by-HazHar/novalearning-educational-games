import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovaLearning Games',
  description:
    'Ubuntu-inspired educational games for South African Grade R children',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFB800',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-nova-sand text-nova-earth overflow-hidden">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'xg2huo - Classifieds Marketplace',
  description: 'Localized classifieds marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

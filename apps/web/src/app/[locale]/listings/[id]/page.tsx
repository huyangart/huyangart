import { useTranslations } from 'next-intl';
import { Button } from '@xg2huo/ui';
import Link from 'next/link';

export default function ListingPage({ params }: { params: { id: string } }) {
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                {t('common.appName')}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/categories">
                <Button variant="ghost">{t('common.categories')}</Button>
              </Link>
              <Link href="/post">
                <Button>{t('common.post')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-20 rounded"></div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">Sample Listing Title</h1>
            <p className="text-3xl font-bold text-blue-600 mb-6">$99.99</p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('listing.description')}</h2>
              <p className="text-gray-700">
                This is a sample description for the listing. In a real application, this would be
                fetched from the API and displayed here.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('listing.location')}</h2>
              <p className="text-gray-700">Sample City, Sample Country</p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">{t('listing.contact')}</Button>
              <Button variant="outline">{t('listing.addToFavorites')}</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

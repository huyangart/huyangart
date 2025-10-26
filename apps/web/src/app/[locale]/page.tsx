import { useTranslations } from 'next-intl';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@xg2huo/ui';
import Link from 'next/link';

export default function HomePage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('home.title')}</h1>
          <p className="text-xl text-gray-600 mb-8">{t('home.subtitle')}</p>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">{t('home.featuredListings')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link key={i} href={`/listings/${i}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <CardTitle>Sample Listing {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">$99.99</p>
                    <p className="text-sm text-gray-500 mt-2">Sample description text...</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

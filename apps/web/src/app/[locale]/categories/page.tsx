import { getTranslations } from 'next-intl/server';
import { Button, Card, CardHeader, CardTitle } from '@xg2huo/ui';
import Link from 'next/link';

export default async function CategoriesPage() {
  const t = await getTranslations();

  const categories = [
    { id: '1', name: 'Electronics', slug: 'electronics' },
    { id: '2', name: 'Vehicles', slug: 'vehicles' },
    { id: '3', name: 'Real Estate', slug: 'real-estate' },
    { id: '4', name: 'Jobs', slug: 'jobs' },
    { id: '5', name: 'Services', slug: 'services' },
    { id: '6', name: 'Home & Garden', slug: 'home-garden' },
  ];

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
        <h1 className="text-3xl font-bold mb-8">{t('categories.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-gray-200 h-32 rounded-md mb-4"></div>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

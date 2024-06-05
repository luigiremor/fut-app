import { Navbar } from '@/components/navbar';
import { getSession } from '@/lib/auth/utils';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.accessToken) {
    return notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:px-8 lg:px-10">
        {children}
      </main>
    </>
  );
}

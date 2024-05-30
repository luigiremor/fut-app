import { Navbar } from '@/components/navbar';
import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Unauthorized</div>;
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

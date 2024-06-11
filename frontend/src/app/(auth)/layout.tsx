import { Navbar } from '@/components/navbar';

export const dynamic = 'force-dynamic';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1 container mx-auto px-4 py-8 md:px-8 lg:px-10 min-h-full">
        {children}
      </main>
    </div>
  );
}

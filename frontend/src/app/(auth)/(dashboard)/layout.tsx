import { getSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function RedirectLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.accessToken) {
    return redirect('/');
  }

  return <>{children}</>;
}

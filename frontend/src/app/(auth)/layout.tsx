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

  return <>{children}</>;
}

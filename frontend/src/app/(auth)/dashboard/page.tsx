import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';

export default async function Auth() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Authorized, {session?.user?.username}</h1>
    </div>
  );
}

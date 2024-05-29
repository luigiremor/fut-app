import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export const getSession = async () => {
  return getServerSession(authOptions);
};

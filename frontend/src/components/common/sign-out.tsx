'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirect: false
    });

    router.push('/');
  }


  return (
    <Button
      variant="secondary"
      className="text-primary"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
};

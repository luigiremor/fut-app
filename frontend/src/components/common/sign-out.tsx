'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/'
    });
  };

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

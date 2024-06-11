'use client';

import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserClub } from '@/types/Api';
import { deleteUserClub } from '@/resolver/user-club/delete-user-club-member';
import { useRouter } from 'next/navigation';

export const DeleteUserClubButton = ({ userClub }: { userClub: UserClub }) => {
  const router = useRouter();

  const handleDeleteUserClub = async () => {
    await deleteUserClub({ userClubId: userClub.id });
    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      disabled={userClub.role === 'owner'}
      onClick={handleDeleteUserClub}
    >
      <Trash />
    </Button>
  );
};

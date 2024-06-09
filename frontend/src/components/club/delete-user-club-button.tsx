'use client';

import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { UserClub } from '@/types/Api';
import { deleteUserClub } from '@/resolver/user-club/delete-user-club-member';

export const DeleteUserClubButton = ({ userClub }: { userClub: UserClub }) => {
  const handleDeleteUserClub = async () => {
    await deleteUserClub({ userClubId: userClub.id });
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

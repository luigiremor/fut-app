'use client';

import { InviteClubDto } from '@/types/Api';
import { Button } from '@/components/ui/button';
import { joinClubInvite } from '@/resolver/club/join-club-invite';
import { useRouter } from 'next/navigation';

export const AcceptJoinInviteButton = ({
  clubName,
  inviteToken
}: InviteClubDto) => {
  const router = useRouter();

  const handleJoinClub = async () => {
    await joinClubInvite({ clubName, inviteToken }).then(() => {
      router.push('/dashboard');
    });
  };

  return (
    <Button className="w-full" onClick={handleJoinClub}>
      Join {clubName}
    </Button>
  );
};

'use client';

import { ShuffleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import api from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const shuffleTeams = (matchId: string) => {
  return api.post(`matches/${matchId}/divide-teams`);
};

export const ShuffleTeamsButton = ({ matchId }: { matchId: string }) => {
  const router = useRouter();

  const handleShuffleTeams = (matchId: string) => {
    const shufflePromise = shuffleTeams(matchId);

    toast.promise(shufflePromise, {
      loading: 'Shuffling Teams...',
      success: () => {
        router.refresh();
        return 'Times divididos';
      },
      error: (error) => {
        return error.message;
      }
    });
  };

  return (
    <Button className="gap-2" onClick={() => handleShuffleTeams(matchId)}>
      <ShuffleIcon className="size-5" />
      Shuffle
    </Button>
  );
};

'use client';

import { PlusIcon } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const joinMatch = async ({
  matchId,
  position
}: {
  matchId: string;
  position: string;
}) => {
  return api.post(`/matches/${matchId}/confirm`, {
    position
  });
};

export const JoinMatchDropdown = ({ matchId }: { matchId: string }) => {
  const router = useRouter();

  const handleJoinMatch = async (position: string) => {
    const joiningMatchPromise = joinMatch({
      matchId,
      position
    });

    toast.promise(joiningMatchPromise, {
      loading: 'Joining Match...',
      success: () => {
        router.refresh();
        return 'Joined Match';
      },
      error: 'Failed to join match'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: 'default' })}>
        <PlusIcon className="w-4 h-4" />
        Join Match
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Join as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleJoinMatch('MID')}>
          Midfielder
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleJoinMatch('FWD')}>
          Forward
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleJoinMatch('DEF')}>
          Defender
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleJoinMatch('GK')}>
          Goalkeeper
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

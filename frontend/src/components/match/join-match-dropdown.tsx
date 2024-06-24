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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: 'default' })}>
        <PlusIcon className="w-4 h-4" />
        Join Match
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Join as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            joinMatch({
              matchId,
              position: 'MID'
            })
          }
        >
          Midfielder
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            joinMatch({
              matchId,
              position: 'FWD'
            })
          }
        >
          Forward
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            joinMatch({
              matchId,
              position: 'DEF'
            })
          }
        >
          Defender
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            joinMatch({
              matchId,
              position: 'GK'
            })
          }
        >
          Goalkeeper
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PiSoccerBallFill } from 'react-icons/pi';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { toast } from 'sonner';
import { RecordGoalDto } from '@/types/Api';

const scoreGoal = async ({
  matchId,
  recordGoalDto
}: {
  matchId: string;
  recordGoalDto: RecordGoalDto;
}) => {
  await api.post(`/matches/${matchId}/record-goal`, {
    team: recordGoalDto.team,
    userId: recordGoalDto.userId
  });
};

const deleteGoal = async ({
  matchId,
  recordGoalDto
}: {
  matchId: string;
  recordGoalDto: RecordGoalDto;
}) => {
  await api.post(`/matches/${matchId}/delete-goal`, {
    team: recordGoalDto.team,
    userId: recordGoalDto.userId
  });
};

export const AddGoalButton = ({
  hasUserAdminPermission,
  userId,
  scoredGoals = 0,
  teamType
}: {
  hasUserAdminPermission: boolean;
  userId: string;
  scoredGoals: number;
  teamType: 'A' | 'B';
}) => {
  const { matchId } = useParams<{
    clubName: string;
    matchId: string;
  }>();
  const router = useRouter();
  const handleAddGoal = async () => {
    const scorePromise = scoreGoal({
      matchId,
      recordGoalDto: {
        team: teamType,
        userId
      }
    });

    toast.promise(scorePromise, {
      loading: 'Recording goal...',
      success: () => {
        router.refresh();

        return 'Goal recorded!';
      },
      error: 'Failed to record goal'
    });
  };

  const handleDeleteGoal = async () => {
    const deletePromise = deleteGoal({
      matchId,
      recordGoalDto: {
        team: teamType,
        userId
      }
    });

    toast.promise(deletePromise, {
      loading: 'Deleting goal...',
      success: () => {
        router.refresh();

        return 'Goal deleted!';
      },
      error: 'Failed to delete goal'
    });
  };

  return (
    <div className="flex gap-4 items-center">
      {hasUserAdminPermission && (
        <Button
          className="gap-2"
          size="sm"
          variant="secondary"
          onClick={handleDeleteGoal}
        >
          <Minus className="size-5" />
        </Button>
      )}

      <p className="flex items-center gap-1">
        <span className="text-lg font-medium w-5">{scoredGoals}</span>
        <PiSoccerBallFill className="size-6 text-muted-foreground" />
      </p>

      {hasUserAdminPermission && (
        <Button
          className="gap-2"
          size="sm"
          variant="secondary"
          onClick={handleAddGoal}
        >
          <Plus className="size-5" />
        </Button>
      )}
    </div>
  );
};

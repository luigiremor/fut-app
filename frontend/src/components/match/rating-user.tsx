'use client';

import api from '@/services/api';
import { StarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AxiosResponse } from 'axios';
import { PlayerRating } from '@/types/Api';
import { toast } from 'sonner';
import { error } from 'console';
import { useRouter } from 'next/navigation';

const rateUser = async (
  matchId: string,
  revieweeId: string,
  rating: number
): Promise<AxiosResponse<PlayerRating>> => {
  return api.post(`/player-ratings`, { matchId, revieweeId, rating });
};

export const RatingUser = ({
  matchId,
  revieweeId,
  currentRate,
  isEditing,
  hasRated
}: {
  matchId: string;
  currentRate: number;
  revieweeId: string;
  isEditing: boolean;
  hasRated: boolean;
}) => {
  const [currentRatingStar, setCurrentStar] = useState(currentRate - 1);
  const router = useRouter();

  return (
    <>
      {Array.from({ length: 5 }, (_, i) => {
        console.log(currentRatingStar);
        const isFilled = !hasRated
          ? i < currentRatingStar
          : i <= currentRatingStar;

        return (
          <StarIcon
            key={`star-${i}`}
            onMouseOut={() => {
              if (isEditing && !hasRated) setCurrentStar(0);
            }}
            onMouseOver={() => {
              if (isEditing && !hasRated) setCurrentStar(i);
            }}
            onClick={() => {
              if (isEditing && !hasRated) {
                const ratingPromise = rateUser(matchId, revieweeId, i + 1);

                toast.promise(ratingPromise, {
                  loading: 'Rating...',
                  success: () => {
                    router.refresh();
                    return 'Rating successful';
                  },
                  error: (error) => error.response.data.message
                });
              }
            }}
            className={cn('size-5 text-muted-foreground fill-muted', {
              'fill-primary text-primary': isFilled,
              'cursor-pointer hover:fill-primary hover:text-primary animate-pulse':
                isEditing && !hasRated
            })}
          />
        );
      })}
    </>
  );
};

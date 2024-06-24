import { JoinMatchDropdown } from '@/components/match/join-match-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSession } from '@/lib/auth/utils';
import api from '@/services/api';
import { Match } from '@/types/Api';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const getMatch = async (
  matchId: string
): Promise<
  AxiosResponse<
    Match & {
      playerPositions: { userId: string; userName: string; position: string }[];
    }
  >
> => {
  return api.get(`/matches/${matchId}`);
};

const positionAcronymsToFull = {
  DEF: 'Defender',
  FWD: 'Forward',
  GK: 'Goalkeeper',
  MID: 'Midfielder'
};

export default async function MatchPage({
  params
}: {
  params: { clubName: string; matchId: string };
}) {
  const { clubName, matchId } = params;

  const session = await getSession();

  const match = await getMatch(matchId);

  const decodedClubName = decodeURIComponent(clubName);

  const isConfirmed = match.data.confirmedUsers.some(
    (user) => user.id === session?.user?.id
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b-[1px] py-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold">{decodedClubName}&apos;s Match</h1>
          <div className="text-muted-foreground">
            <span className="font-medium">Location:</span> {match.data.location}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <div className="text-muted-foreground">
            {format(match.data.date, 'PPpp')}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Confirmed Players</div>

          {!isConfirmed && <JoinMatchDropdown matchId={matchId} />}
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {match.data.playerPositions.map(
              (playerPosition: {
                userId: string;
                userName: string;
                position: string;
              }) => (
                <div
                  className="flex items-center gap-3"
                  key={playerPosition.userId}
                >
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {playerPosition.userName.slice(0, 2).toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <div className="font-medium">{playerPosition.userName}</div>
                    <div className="text-xs text-muted-foreground">
                      {
                        positionAcronymsToFull[
                          playerPosition.position as keyof typeof positionAcronymsToFull
                        ]
                      }
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

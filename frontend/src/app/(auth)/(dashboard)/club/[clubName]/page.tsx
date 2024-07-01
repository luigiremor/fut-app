import { ManageRolesCard } from '@/components/club/manage-roles-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getHasAdminPermission } from '@/resolver/club/get-has-admin-permission';
import api from '@/services/api';
import { Match, User } from '@/types/Api';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import { matchCapacityStatusToColor } from '../../dashboard/page';
import { Icons } from '@/components/common/icons';
import { Clock, LocateFixed } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNonRelativeNext,
  CarouselNonRelativePrevious
} from '@/components/ui/carousel';

const getUpcomingMatchesForClub = async (
  clubName: string
): Promise<AxiosResponse<Match[]>> => {
  const response = api.get(`matches/club/${clubName}/upcoming`);

  return response;
};

const getMostActiveMembers = async (
  clubName: string
): Promise<AxiosResponse<{ user: User; count: number }[]>> => {
  const response = api.get(`clubs/${clubName}/users/most-active`);

  return response;
};

const getRanking = async (
  clubName: string
): Promise<AxiosResponse<{ user: User; averageRating: number }[]>> => {
  const response = api.get(`clubs/${clubName}/users/most-ranked`);

  return response;
};

const getMostScorers = async (
  clubName: string
): Promise<AxiosResponse<{ user: User; goals: number }[]>> => {
  const response = api.get(`/clubs/${clubName}/users/most-goals`);

  return response;
};

export default async function ClubPage({
  params
}: {
  params: { clubName: string };
}) {
  const { clubName } = params;

  const decodedClubName = decodeURIComponent(clubName);

  const hasUserAdminPermission = await getHasAdminPermission(decodedClubName);

  const { data: upcomingMatches } =
    await getUpcomingMatchesForClub(decodedClubName);
  const { data: mostActiveMembers } =
    await getMostActiveMembers(decodedClubName);
  const { data: rankingMembers } = await getRanking(decodedClubName);
  const { data: mostScorers } = await getMostScorers(decodedClubName);

  const sortedUpcomingMatches = upcomingMatches.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <section className="mb-8 flex flex-col gap-2">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold mb-2">{decodedClubName} Dashboard</h2>

        <Link
          href={`/club/${decodedClubName}/match/create`}
          className={buttonVariants({
            variant: 'default'
          })}
        >
          Create New Match
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ManageRolesCard hasAdminPermission={hasUserAdminPermission} />
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <Carousel>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Upcoming Games</CardTitle>
              <div className="flex gap-2">
                <CarouselNonRelativePrevious />
                <CarouselNonRelativeNext />
              </div>
            </CardHeader>
            <CardContent>
              <CarouselContent className="px-4 space-x-4">
                {sortedUpcomingMatches.map((match, index) => (
                  <CarouselItem
                    className="bg-gray-100 p-4 rounded-lg flex flex-col gap-4 basis-1/2"
                    key={match.id}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">Game {index + 1}</h3>
                      <div
                        className={cn(
                          'flex items-center space-x-4 px-2 rounded-full',
                          matchCapacityStatusToColor(
                            match.confirmedUsers.length
                          )
                        )}
                      >
                        <p>{match.confirmedUsers.length}/16</p>
                        <Icons.users className="size-5" />
                      </div>
                    </div>
                    <p className="text-muted-foreground flex items-center">
                      <Clock className="size-5 mr-2" />
                      {format(match.date, 'PPpp')}
                    </p>
                    <p className="text-muted-foreground flex items-center">
                      <LocateFixed className="size-5 mr-2" />
                      {match.location}
                    </p>

                    <Link
                      href={`/club/${decodedClubName}/match/${match.id}`}
                      className={cn(
                        'mt-2',
                        buttonVariants({
                          variant: 'outline'
                        })
                      )}
                    >
                      View Details
                    </Link>
                  </CarouselItem>
                ))}
                {sortedUpcomingMatches.length === 0 && (
                  <p className="text-muted-foreground text-center text-lg flex justify-center w-full">
                    No upcoming games
                  </p>
                )}
              </CarouselContent>
            </CardContent>
          </Carousel>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Top Scorers</h3>
                {mostScorers.slice(0, 2).map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="border">
                      <AvatarFallback>
                        {member.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-muted-foreground">
                        {member.user.username}
                      </p>
                      <p className="font-bold">{member.goals} Goals</p>
                    </div>
                  </div>
                ))}
                {mostScorers.length === 0 && (
                  <p className="text-muted-foreground text-center text-lg">
                    No scorers yet
                  </p>
                )}
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Most Games Played</h3>
                {mostActiveMembers.slice(0, 2).map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="border">
                      <AvatarFallback>
                        {member.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-muted-foreground">
                        {member.user.username}
                      </p>
                      <p className="font-bold">{member.count} Games</p>
                    </div>
                  </div>
                ))}
                {mostActiveMembers.length === 0 && (
                  <p className="text-muted-foreground text-center text-lg">
                    No active members
                  </p>
                )}
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Highest Rated</h3>
                {rankingMembers.slice(0, 2).map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="border">
                      <AvatarFallback>
                        {member.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-muted-foreground">
                        {member.user.username}
                      </p>
                      <p className="font-bold">
                        {member.averageRating.toFixed(1)} Rating
                      </p>
                    </div>
                  </div>
                ))}
                {rankingMembers.length === 0 && (
                  <p className="text-muted-foreground text-center text-lg">
                    No ranked members
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { Icons } from '@/components/common/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNonRelativeNext,
  CarouselNonRelativePrevious
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { getMyClubs } from '@/resolver/club/get-my-clubs';
import api from '@/services/api';
import { Match } from '@/types/Api';
import { paths } from '@/utils/paths';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export const dynamic = 'force-dynamic';

const getUpcomingMatches = async (): Promise<AxiosResponse<Match[]>> => {
  return await api.get('/matches/user/me/upcoming');
};

const TOTAL_CAPACITY = 16;

export const matchCapacityStatusToColor = (confirmedUsers: number) => {
  if (confirmedUsers >= Math.floor(TOTAL_CAPACITY * 0.75)) {
    return 'bg-destructive/20 text-destructive';
  }

  if (confirmedUsers >= TOTAL_CAPACITY / 2) {
    return 'bg-yellow-500/20 text-yellow-500';
  }

  return 'bg-primary/20 text-primary';
};

export default async function Dashboard() {
  const myClubs = await getMyClubs();
  const upcomingMatches = await getUpcomingMatches();

  const sortedUpcomingMatches = upcomingMatches.data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="flex flex-col space-y-4 ">
      <section className="">
        <Carousel>
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Upcoming Matches</h1>
          </div>
          <CarouselContent className="py-4">
            {sortedUpcomingMatches.map((upcomingMatch, index) => (
              <CarouselItem
                key={`carousel-${index}`}
                className="sm:basis-1/2 lg:basis-1/3"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {upcomingMatch.club.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold">
                            {upcomingMatch.club.name}
                          </h3>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex items-center space-x-4 px-2 rounded-full',
                          matchCapacityStatusToColor(
                            upcomingMatch.confirmedUsers.length
                          )
                        )}
                      >
                        <p>{upcomingMatch.confirmedUsers.length}/16</p>
                        <Icons.users className="size-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Icons.calendar className="size-5" />
                          <p>{format(new Date(upcomingMatch.date), 'PP')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icons.clock className="size-5" />
                          <p>{format(new Date(upcomingMatch.date), 'p')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icons.map className="size-5" />
                          <p>{upcomingMatch.location}</p>
                        </div>
                      </div>
                      <Link
                        href={`/club/${upcomingMatch.club.name}/match/${upcomingMatch.id}`}
                        className={buttonVariants({
                          variant: 'default'
                        })}
                      >
                        Join
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex gap-2">
            <CarouselNonRelativePrevious />
            <CarouselNonRelativeNext />
          </div>
        </Carousel>
      </section>
      <section>
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold">My clubs</h2>
          <Link
            href={paths.auth.club.create}
            className={cn(
              buttonVariants({
                variant: 'outline'
              }),
              'gap-2'
            )}
          >
            <Icons.plus className="size-5" />
            Create club
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 py-4">
          {myClubs.map((club) => {
            return (
              <Card key={club.name} className="">
                <CardHeader className="flex flex-row justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>TA</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold">{club.name}</h3>
                      <div className="text-sm text-secondary-foreground flex items-center space-x-2">
                        <span>
                          <Icons.users className="size-4" />
                        </span>
                        <h4>{club.userClubs.length} members</h4>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/club/${club.name}`}
                    className={cn(
                      buttonVariants({
                        variant: 'default',
                        size: 'icon'
                      })
                    )}
                  >
                    <FaArrowRightLong />
                  </Link>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>
      <h2 className="text-3xl font-semibold">My matches</h2>
    </div>
  );
}

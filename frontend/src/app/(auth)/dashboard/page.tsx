import { Icons } from '@/components/common/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getMyClubs } from '@/resolver/club/get-my-clubs';
import { paths } from '@/utils/paths';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default async function Dashboard() {
  const myClubs = await getMyClubs();

  return (
    <div className="grid space-y-4">
      <section>
        <h1 className="text-3xl font-bold">Upcoming Matches</h1>
        <div className="snap-x snap-mandatory overflow-x-auto flex space-x-4 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              className="snap-start flex-shrink-0 sm:min-w-[calc(100%-1rem)] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(30%-1rem)]"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>TA</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">Team A</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-primary/20 px-2 rounded-full text-primary">
                    <p>10/16</p>
                    <Icons.users className="size-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-secondary-foreground">
                    <div className="flex items-center space-x-2">
                      <Icons.calendar className="size-5" />
                      <p>May 30, 2024</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.clock className="size-5" />
                      <p>7:00 PM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.map className="size-5" />
                      <p>Field 1</p>
                    </div>
                  </div>
                  <Button>Join</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
        <div className="snap-x snap-mandatory overflow-x-auto flex space-x-4 py-4">
          {myClubs.map((club) => {
            return (
              <Card
                key={club.name}
                className="snap-start flex-shrink-0 sm:min-w-[calc(100%-1rem)] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(30%-1rem)]"
              >
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

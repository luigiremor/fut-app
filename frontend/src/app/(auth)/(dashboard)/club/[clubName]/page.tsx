import { ManageRolesCard } from '@/components/club/manage-roles-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getHasAdminPermission } from '@/resolver/club/get-has-admin-permission';
import Link from 'next/link';

export default async function ClubPage({
  params
}: {
  params: { clubName: string };
}) {
  const { clubName } = params;

  const decodedClubName = decodeURIComponent(clubName);

  const hasUserAdminPermission = await getHasAdminPermission(decodedClubName);

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
          <CardHeader>
            <CardTitle>Upcoming Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Game 1</h3>
                <p className="text-gray-500 mb-2">June 1, 2023 - 7:00 PM</p>
                <p className="text-gray-500 mb-2">Home Team vs Away Team</p>
                <Button variant="outline" className="mt-2">
                  View Details
                </Button>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Game 2</h3>
                <p className="text-gray-500 mb-2">June 8, 2023 - 3:00 PM</p>
                <p className="text-gray-500 mb-2">Home Team vs Away Team</p>
                <Button variant="outline" className="mt-2">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Top Scorers</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 1" />
                    <AvatarFallback>P1</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 1</p>
                    <p className="font-bold">25 Goals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 2" />
                    <AvatarFallback>P2</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 2</p>
                    <p className="font-bold">20 Goals</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Top Assisters</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 3" />
                    <AvatarFallback>P3</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 3</p>
                    <p className="font-bold">15 Assists</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 4" />
                    <AvatarFallback>P4</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 4</p>
                    <p className="font-bold">12 Assists</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Most Games Played</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 5" />
                    <AvatarFallback>P5</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 5</p>
                    <p className="font-bold">45 Games</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 6" />
                    <AvatarFallback>P6</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 6</p>
                    <p className="font-bold">40 Games</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Highest Rated</h3>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 7" />
                    <AvatarFallback>P7</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 7</p>
                    <p className="font-bold">4.8 Rating</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar>
                    <img src="/placeholder.svg" alt="Player 8" />
                    <AvatarFallback>P8</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-500">Player 8</p>
                    <p className="font-bold">4.6 Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

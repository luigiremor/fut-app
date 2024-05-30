import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default async function Auth() {
  return (
    <div>
      <section>
        <h1 className="text-3xl font-bold mb-6">Upcoming Matches</h1>
        <div className="snap-x snap-mandatory overflow-x-auto flex space-x-4 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              className="snap-start flex-shrink-0 sm:min-w-[calc(100%-1rem)] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(30%-1rem)]"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">Team A</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="">Date: May 30, 2024</p>
                    <p className="">Time: 7:00 PM</p>
                    <p className="">Location: Field 1</p>
                  </div>
                  <Button>Join</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <h2 className="text-3xl font-semibold">Clubs</h2>
      <h2 className="text-3xl font-semibold">Games</h2>
    </div>
  );
}

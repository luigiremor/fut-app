import { AcceptJoinInviteButton } from '@/components/club/accept-join-invite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getSession } from '@/lib/auth/utils';
import { paths } from '@/utils/paths';
import { redirect } from 'next/navigation';

export default async function JoinInvitePage({
  searchParams
}: {
  searchParams: {
    clubName: string;
    inviteToken: string;
  };
}) {
  const { clubName, inviteToken } = searchParams;

  const session = await getSession();

  console.log('session', session);

  if (!session?.accessToken) {
    const redirectTo = encodeURIComponent(
      `${paths.auth.join}?clubName=${clubName}&inviteToken=${inviteToken}`
    );
    return redirect(`${paths.public.home}?redirectTo=${redirectTo}`);
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="md:max-w-xl w-full">
        <CardHeader>
          <CardTitle>Joining {clubName}</CardTitle>
          <CardDescription>
            You have been invited to join {clubName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            To join <span className="text-xl font-medium">{clubName}</span>,
            click the button below to accept the invite.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <AcceptJoinInviteButton
            clubName={clubName}
            inviteToken={inviteToken}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

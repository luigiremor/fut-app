import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { getClubMembers } from '@/resolver/get-club-members';
import { UserClub } from '@/types/Api';

export default async function ClubAdminView({
  params
}: {
  params: { clubName: string };
}) {
  const { clubName } = params;

  const clubMembers: UserClub[] = await getClubMembers(clubName);

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage your members roles</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubMembers.map((member) => (
              <TableRow key={member.id} className="odd:bg-accent">
                <TableCell>{member.user.username}</TableCell>
                <TableCell>{member.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

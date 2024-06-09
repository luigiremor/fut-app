import { SelectRole } from '@/components/club/select-role';
import { Button } from '@/components/ui/button';
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
import { getHasAdminPermission } from '@/resolver/get-has-admin-permission';
import { UpdateUserClubDto, UserClub } from '@/types/Api';
import { Trash } from 'lucide-react';

export default async function ClubAdminView({
  params
}: {
  params: { clubName: string };
}) {
  const { clubName } = params;

  const clubMembers: UserClub[] = await getClubMembers(clubName);

  console.log(clubMembers);

  const hasUserAdminPermission = await getHasAdminPermission(clubName);

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
              <TableHead>Role</TableHead>
              {hasUserAdminPermission && <TableHead>Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubMembers.map((member) => (
              <TableRow key={member.id} className="odd:bg-accent">
                <TableCell>{member.user.username}</TableCell>
                {!hasUserAdminPermission && (
                  <TableCell>{member.role}</TableCell>
                )}
                {hasUserAdminPermission && (
                  <TableCell>
                    <SelectRole
                      userClubId={member.id}
                      clubId={member.club.id}
                      role={member.role as UpdateUserClubDto['role']}
                    />
                  </TableCell>
                )}
                {hasUserAdminPermission && (
                  <TableCell>
                    <Button
                      variant="destructive"
                      disabled={member.role === 'owner'}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

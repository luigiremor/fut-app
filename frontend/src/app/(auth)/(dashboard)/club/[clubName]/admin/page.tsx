import { DeleteUserClubButton } from '@/components/club/delete-user-club-button';
import { SelectRole } from '@/components/club/select-role';
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
import { getHasAdminPermission } from '@/resolver/club/get-has-admin-permission';
import { getClubMembers } from '@/resolver/user-club/get-club-members';
import { UpdateUserClubDto, UserClub } from '@/types/Api';

export default async function ClubAdminView({
  params
}: {
  params: { clubName: string };
}) {
  const { clubName } = params;

  const clubMembers: UserClub[] = await getClubMembers(clubName);

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
            {clubMembers.map((userClub) => (
              <TableRow key={userClub.id} className="odd:bg-accent">
                <TableCell>{userClub.user.username}</TableCell>
                {!hasUserAdminPermission && (
                  <TableCell>{userClub.role}</TableCell>
                )}
                {hasUserAdminPermission && (
                  <TableCell>
                    <SelectRole
                      userClubId={userClub.id}
                      clubId={userClub.club.id}
                      role={userClub.role as UpdateUserClubDto['role']}
                    />
                  </TableCell>
                )}
                {hasUserAdminPermission && (
                  <TableCell>
                    <DeleteUserClubButton userClub={userClub} />
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

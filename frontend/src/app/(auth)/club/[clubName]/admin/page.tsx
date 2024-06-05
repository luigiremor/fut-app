'use client';
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

export default function ClubAdminView({
  params
}: {
  params: { clubName: string };
}) {
  const { clubName } = params;

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
            <TableRow className="bg-accent">
              <TableCell>Name</TableCell>
              <TableCell>Sale</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

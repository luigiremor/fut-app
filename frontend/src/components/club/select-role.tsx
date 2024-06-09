'use client';

import { UpdateUserClubDto } from '@/types/Api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { updateRole } from '@/resolver/user-club/update-member-role';

export const SelectRole = ({
  userClubId,
  role,
  clubId
}: {
  userClubId: string;
  role: UpdateUserClubDto['role'];
  clubId: string;
}) => {
  const onValueChange = async (
    value: NonNullable<UpdateUserClubDto['role']> | string
  ) => {
    await updateRole({ role: value, userClubId, clubId });
  };

  return (
    <Select
      defaultValue={role}
      disabled={role === 'owner'}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
      </SelectContent>
    </Select>
  );
};

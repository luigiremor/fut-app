import api from '@/services/api';
import { UpdateUserClubDto } from '@/types/Api';

export const updateRole = async ({
  role,
  clubId,
  userClubId
}: {
  role: NonNullable<UpdateUserClubDto['role']> | string;
  clubId: string;
  userClubId: string;
}) => {
  return await api.patch(`/user-club/${userClubId}`, { role, clubId });
};

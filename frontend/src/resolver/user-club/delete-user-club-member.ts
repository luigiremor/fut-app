import api from '@/services/api';
import { toast } from 'sonner';

export const deleteUserClub = async ({
  userClubId
}: {
  userClubId: string;
}) => {
  return await api.delete(`/user-club/${userClubId}`).catch((error) => {
    toast.error(error.response.data.message);
  });
};

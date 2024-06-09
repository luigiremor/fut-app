import api from '@/services/api';
import { toast } from 'sonner';

export const getClubMembers = async (clubName: string) => {
  const res = await api
    .get(`/user-club/club/${clubName}/users`)
    .catch((error) => {
      toast.error(error.response.data.message);
    });

  return res?.data;
};

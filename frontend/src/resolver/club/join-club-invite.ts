import api from '@/services/api';
import { InviteClubDto } from '@/types/Api';
import { toast } from 'sonner';

export const joinClubInvite = async (inviteClubDto: InviteClubDto) => {
  const response = await api
    .post('/clubs/join', inviteClubDto)
    .catch((error) => {
      console.log('error', error);
      toast.error(error.response.data.message);
    });

  return response?.data;
};

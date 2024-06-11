import api from '@/services/api';
import { CreateInviteLinkDto } from '@/types/Api';
import { toast } from 'sonner';

export const createClubInvite = async (
  createInviteLinkDto: CreateInviteLinkDto
) => {
  const response = await api
    .post('/clubs/invite', createInviteLinkDto)
    .catch((error) => {
      toast.error(error.response.data.message);
    });

  return response?.data;
};

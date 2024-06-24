import api from '@/services/api';
import { CreateMatchDto } from '@/types/Api';
import { toast } from 'sonner';

export const createClubInvite = async (createMatchDto: CreateMatchDto) => {
  const response = await api.post('/matches', createMatchDto).catch((error) => {
    toast.error(error.response.data.message);
  });

  return response?.data;
};

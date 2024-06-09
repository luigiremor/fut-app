import api from '@/services/api';
import { Club } from '@/types/Api';
import { toast } from 'sonner';

export const getMyClubs = async (): Promise<Club[]> => {
  const response = await api.get('/clubs/user/me').catch((error) => {
    toast.error(error.response.data.message);
  });

  return response?.data;
};

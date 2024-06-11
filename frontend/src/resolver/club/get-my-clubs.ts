import api from '@/services/api';
import { Club } from '@/types/Api';

export const getMyClubs = async (): Promise<Club[]> => {
  const response = await api.get('/clubs/user/me');

  return response?.data;
};

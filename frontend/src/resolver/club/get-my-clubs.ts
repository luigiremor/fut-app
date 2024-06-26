import api from '@/services/api';
import { Club } from '@/types/Api';
import { HttpStatusCode } from 'axios';

export const getMyClubs = async (): Promise<Club[]> => {
  const response = await api.get('/clubs/user/me').catch((error) => {
    console.error(error);
    return error.response;
  });

  if (response.status === HttpStatusCode.Unauthorized)
    throw HttpStatusCode.PermanentRedirect;

  return response?.data;
};

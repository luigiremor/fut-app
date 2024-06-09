import api from '@/services/api';
import { toast } from 'sonner';

export const getHasAdminPermission = async (clubName: string) => {
  const res = await api.get(`/clubs/${clubName}/is-admin`).catch((error) => {
    toast.error(error.response.data.message);
  });

  return res?.data;
};

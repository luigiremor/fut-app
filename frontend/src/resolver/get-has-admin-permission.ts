import api from '@/services/api';

export const getHasAdminPermission = async (clubName: string) => {
  const res = await api.get(`/clubs/${clubName}/is-admin`);

  return res.data;
};

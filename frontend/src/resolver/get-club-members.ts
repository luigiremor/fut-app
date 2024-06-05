import api from '@/services/api';

export const getClubMembers = async (clubName: string) => {
  const res = await api.get(`/user-club/club/${clubName}/users`);

  return res.data;
};

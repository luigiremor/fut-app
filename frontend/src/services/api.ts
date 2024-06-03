'use server';

import { getSession } from '@/lib/auth/utils';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/'
});

api.interceptors.request.use(
  async function onFulfilled(config) {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  async function onError(error) {
    return Promise.reject(error);
  }
);

export default api;

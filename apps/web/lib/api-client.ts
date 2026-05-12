import { ApiClient, GetTokenFn } from '@health-competition/shared';
import { getSession } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getToken: GetTokenFn = async () => {
  const session = await getSession();
  return session?.access_token;
};

export const apiClient = new ApiClient(API_URL, getToken);

import axios from 'axios';

const token = localStorage.getItem('churchSongsToken');

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: token ? { Authorization: `Bearer ${token}` } : undefined
});

export const setApiToken = (value?: string) => {
  if (value) {
    api.defaults.headers.common.Authorization = `Bearer ${value}`;
    localStorage.setItem('churchSongsToken', value);
    return;
  }

  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem('churchSongsToken');
};

import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { Register } from '@/types/form';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}
export function login(data: LoginData) {
  // return axios.post<LoginRes>('/api/user/login', data);
  return axios.post<LoginRes>('/api/auth/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export function register(form: Register) {
  return axios.post<UserState>('/api/auth/register', form)
}

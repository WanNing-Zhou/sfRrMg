import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { RegisterData } from "@/types/form";

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}

export interface RegisterRes{
  access_token: string;
}

export function login(data: LoginData) {
  // return axios.post<LoginRes>('/api/user/login', data);
  return axios.post<LoginRes>('/api/auth/login', data);
}

export function register(form: RegisterData){
  return axios.post<RegisterRes>('/api/auth/register', form)
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/auth/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}


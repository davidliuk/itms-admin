import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
// store中的user各个字段的类型

export interface LoginData {
  username: string;
  email: string;
  password: string;
}

export interface LoginRes {
  // 定义了一个接口，包含 token 字段，用于表示登录响应的数据。
  token: string;
}
// export function login(data: LoginData) {
//   return axios.post<LoginRes>('/api/user/login', data);
//   // 接受一个 LoginData 类型的参数 data，发送一个 POST 请求到 /api/user/login 接口，
//   // 并期望返回一个 LoginRes 类型的响应。
// }
export function login(data: LoginData) {
  return axios.post<LoginRes>('/admin/acl/index/login', data);
  // 接受一个 LoginData 类型的参数 data，发送一个 POST 请求到 /api/user/login 接口，
  // 并期望返回一个 LoginRes 类型的响应。
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
// RouteRecordNormalized可以在代码中使用该类型来声明变量、参数、返回类型等，
// 以便进行类型检查和类型推断，从而提高代码的可读性和可维护性。

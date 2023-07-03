import axios from 'axios';
import qs from 'query-string';

export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface Role {
  // 内容不影响
  id: string;
  name: string;
  code: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

export interface RoleParams extends Partial<Role> {
  current: number;
  pageSize: number;
}

export interface PageRes<T> {
  list: T[];
  total: number;
}

export function queryRoleList(params: RoleParams) {
  return axios.get<PageRes<Role>>('/admin/acl/role', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface Admin {
  // 内容不影响
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  wareId: string;
  stationId: string;
  createTime: Date;
  updateTime: Date;
}

// export interface AdminParams extends Partial<Admin> {
//   current: number;
//   pageSize: number;
// }

// export function queryAdminList(params: AdminParams) {
//   return axios.get<PageRes<Admin>>('/admin/acl/admin', {
//     params,
//     paramsSerializer: (obj) => {
//       return qs.stringify(obj);
//     },
//   });
// }

export function queryAdminList(
  current: number,
  limit: number,
  params: Partial<Admin>
) {
  return axios.get<PageRes<Admin>>(`/admin/acl/admin/${current}/${limit}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface Permission {
  // 内容不影响
  id: number;
  pid: number;
  level: number;
  name: string;
  code: string;
  toCode: string;
  type: number;
  status: number;
  select: boolean;
  createTime: string;
  updateTime: string;
  children: Permission[];
}

// export function queryPermissionList(
//   current: number,
//   limit: number,
//   params: Partial<Permission>
// ) {
//   return axios.get<PageRes<Permission>>(
//     `/admin/acl/permission/${current}/${limit}`,
//     {
//       params,
//       paramsSerializer: (obj) => {
//         return qs.stringify(obj);
//       },
//     }
//   );
// }

export function queryPermissionList() {
  return axios.get<Permission[]>(`/admin/acl/permission`);
}
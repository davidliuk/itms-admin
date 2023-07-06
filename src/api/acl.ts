import axios from 'axios';

export interface Role {
  // 内容不影响
  id: string;
  name: string;
  code: string;
  remark: string;
  createTime: Date;
  updateTime: Date;
}

export interface PageRes<T> {
  records: T[];
  total: number;
}

export function queryRoleList(
  current: number,
  limit: number,
  params: Partial<Role>
) {
  return axios.post<PageRes<Role>>(`/admin/acl/role/${current}/${limit}`, {
    params,
    // paramsSerializer: (obj) => {
    //   return qs.stringify(obj);
    // },
  });
}

export function toAssign(adminId: string) {
  return axios.get<any>(`/admin/acl/user/toAssign/${adminId}`);
}
export function doAssign(adminId: string, roleIds: string[]) {
  return axios.post<any>(`/admin/acl/user/doAssign/${adminId}`, roleIds);
}
export function findAllList() {
  return axios.get<Role[]>('/admin/acl/role/findAllList');
}
export function addRole(role: Role) {
  return axios.post<any>('/admin/acl/role', role);
}
export function updateRole(role: Role) {
  return axios.put<any>('/admin/acl/role', role);
}

export function deleteRole(role: Role) {
  return axios.post<any>('/admin/acl/role', role);
}

export interface Admin {
  // 内容不影响
  id: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  wareId: string;
  stationId: string;
  createTime: Date;
  updateTime: Date;
}

export function queryAdminList(
  current: number,
  limit: number,
  params: Partial<Admin>
) {
  return axios.post<PageRes<Admin>>(`/admin/acl/user/${current}/${limit}`, {
    params,
    // paramsSerializer: (obj) => {
    //   return qs.stringify(obj);
    // },
  });
}

export function addAdmin(admin: Admin) {
  return axios.post<any>('/admin/acl/user', admin);
}

export function updateAdmin(admin: Admin) {
  return axios.put<any>('/admin/acl/user', admin);
}

export function deleteAdmin(id: number) {
  return axios.delete<any>(`/admin/acl/user/${id}`);
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

export function queryPermissionList() {
  return axios.get<Permission[]>(`/admin/acl/permission`);
}

export function addPermission(permission: Permission) {
  return axios.post<any>('/admin/acl/permission', permission);
}

export function updatePermission(permission: Permission) {
  return axios.put<any>('/admin/acl/permission', permission);
}

export function deletePermission(id: number) {
  return axios.delete<any>(`/admin/acl/permission/${id}`);
}

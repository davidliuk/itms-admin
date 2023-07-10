export type RoleType = '' | '*' | 'admin' | 'user';
// RoleType 是一个联合类型（Union Type），它表示用户角色类型。
// 它包含四个可能的取值："''"（空字符串）、"''"、"'admin'" 和 "'user'"。
export interface UserState {
  id?: string;
  name?: string;
  username?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
  roles: string[];
  permissions: string[];
  // 在 TypeScript 中，? 是一个可选属性的标记，
  // 用于指示属性是可选的，即可以存在也可以不存在。
}

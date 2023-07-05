import type { RouteRecordNormalized } from 'vue-router';
// RouteRecordNormalized 类型，可以在当前的代码文件中使用该类型来声明和操作路由记录
// 用于描述和规范化路由记录的数据结构。它包含了路由的各种属性和配置信息，如路径、组件、子路由等。

export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string; // 标识当前设备的类型
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  [key: string]: unknown;
}

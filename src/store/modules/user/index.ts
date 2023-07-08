import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  codeLogin,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    username: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: 'admin',
    roles: [],
    permissions: [],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // 转化角色
    // 学习文件夹\promise
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },

    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    // Partial<UserState> 表示 UserState 类型的部分属性可选。
    // $patch 方法用于将一个部分状态对象合并到当前的状态对象中，实现部分更新的功能。
    // 它可以接收一个部分状态对象作为参数，然后将该对象的属性合并到当前的状态对象中。

    // Reset user's information
    resetInfo() {
      this.$reset();
    },
    // 用户信息重置为初始状态或默认值。

    // Get user's information
    async info() {
      const res = await getUserInfo();

      this.setInfo(res.data);
    },
    // axios.post() 方法返回的是一个 Promise 对象
    // await 关键字来调用一个返回 Promise 对象的异步操作时，它会暂停函数的执行，等待 Promise 对象的解析（即状态变为 Fulfilled）并返回结果。
    // 在等待期间，函数会暂时阻塞，不会继续执行后续代码。一旦 Promise 对象解析完成，await 表达式将返回解析的结果，并继续执行函数。

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.token);
        this.setInfo(res.data.user);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    async loginCode(loginForm: LoginData) {
      try {
        const res = await codeLogin(loginForm);
        setToken(res.data.token);
        this.setInfo(res.data.user);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;

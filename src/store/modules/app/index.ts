import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
      // serverMenu表示从服务器获取的菜单数据
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },

    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null; // 用于存储通知实例
      try {
        notifyInstance = Notification.info({
          // 提示信息+解释①
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const { data } = await getMenuList();
        this.serverMenu = data;
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },

    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;

// 解释①：info方法详细阐述
// Notification.info({...}) 方法，用于创建信息类型的通知提示，您可以传递以下参数来配置通知的内容和行为：
// id（可选）: 通知的唯一标识符，用于在需要时关闭或更新通知。通常用于管理通知实例的生命周期。
// content（必需）: 通知的内容，通常是一段文本或 HTML 片段，用于显示在通知提示中。
// closable（可选）: 是否显示关闭按钮，用于允许用户手动关闭通知。默认值为 false，即不显示关闭按钮。

// 解释②：Notification中包含的函数
// Notification.info({...})：一个方法，用于创建信息类型的通知提示。
// Notification.success({...})：一个方法，用于创建成功类型的通知提示。
// Notification.warning({...})：一个方法，用于创建警告类型的通知提示。
// Notification.error({...})：一个方法，用于创建错误类型的通知提示。
// Notification.close(id: string)：一个方法，用于关闭指定 id 的通知提示。
// Notification.closeAll()：一个方法，用于关闭所有的通知提示。
// Notification.config({...})：一个方法，用于全局配置通知的默认行为和样式。
// Notification.setGlobalConfig({...})：一个方法，用于设置全局通知的默认配置。

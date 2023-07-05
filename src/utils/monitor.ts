import { App, ComponentPublicInstance } from 'vue';
import axios from 'axios';

export default function handleError(Vue: App, baseUrl: string) {
  if (!baseUrl) {
    return;
  }
  Vue.config.errorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => {
    // send error info
    axios.post(`${baseUrl}/report-error`, {
      err,
      instance,
      info,
      // location: window.location.href,
      // message: err.message,
      // stack: err.stack,
      // browserInfo: getBrowserInfo(),
      // user info
      // dom info
      // url info
      // ...
    });
  };
}

// 为 Vue 应用程序配置全局的错误处理程序。
// 当应用程序中发生错误时，会触发错误处理程序，
// 将错误信息发送到指定的 baseUrl 上的 /report-error 路径。

// utils是工具库
const TOKEN_KEY = 'token';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export { isLogin, getToken, setToken, clearToken };

// 解释①：localStorage是什么？
// localStorage 是 Web 浏览器提供的一种机制，用于在浏览器中存储数据。
// 它允许开发者在客户端（即用户的浏览器）中存储和检索数据，以实现持久化的本地存储。

import axios from 'axios';

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'https://nav-item-worker.8361048.workers.dev/api',
  timeout: 10000,
});

// 请求拦截器：自动注入认证信息
request.interceptors.request.use(
  (config) => {
    // 优先使用固定密钥（如果存在）
    const ADMIN_SECRET = 'nav-admin-secret-key';
    if (ADMIN_SECRET) {
      config.headers['x-admin-secret'] = ADMIN_SECRET;
      return config;
    }

    // 否则使用 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 处理 401 未授权错误
      if (error.response.status === 401) {
        // 清除无效的 Token
        localStorage.removeItem('token');
        // 可以在这里跳转到登录页面
        console.error('认证失败，请重新登录');
      }
      return Promise.reject(error.response.data || error.message);
    }
    return Promise.reject(error.message);
  }
);

export default request;
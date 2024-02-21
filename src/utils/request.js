import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 6000,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code !== 10000) {
      Message({
        message: response.data.msg,
        type: "error",
      });
    }

    return response.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;

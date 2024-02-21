import request from "@/utils/request";

// 登录
export function loginApi(data) {
  return request({
    url: "/park/login",
    method: "POST",
    data,
  });
}

// 获取用户信息
export function getInfoApi() {
  return request({
    url: "/system/user/dropList",
    method: "get",
  });
}

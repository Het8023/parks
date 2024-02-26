import request from "@/utils/request";

// 系统管理-用户管理-用户列表
export function getUserListApi(data) {
  return request({
    url: `/park/sys/user?page=${data.page}&pageSize=${data.pageSize}&name=${data.name}`,
    method: "get",
  });
}

// 系统管理-角色管理-查询所有角色
export function getroleListApi() {
  return request({
    url: "/park/sys/role",
    method: "get",
  });
}

// 系统管理-用户管理-添加用户
export function getAdduserApi(data) {
  return request({
    url: "/park/sys/user",
    method: "POST",
    data,
  });
}

// 系统管理-用户管理-用户详情
export function getuserDetailApi(id) {
  return request({
    url: `/park/sys/user/${id}`,
  });
}

// 系统管理-用户管理-编辑用户
export function getEdituserApi(data) {
  return request({
    url: "/park/sys/user",
    method: "PUT",
    data,
  });
}

// 系统管理-用户管理-删除用户
export function getDeluserApi(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: "delete",
  });
}

// 系统管理-用户管理-重置密码
export function getresetPwdApi(data) {
  return request({
    url: "/park/sys/user/resetPwd",
    method: "PUT",
    data,
  });
}

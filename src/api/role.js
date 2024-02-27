import request from "@/utils/request";

// 系统管理-角色管理-查询所有角色
export function getroleListApi() {
  return request({
    url: "/park/sys/role",
    method: "get",
  });
}

// 系统管理-角色管理-查询所有功能权限(树形)
export function getAllTreeApi() {
  return request({
    url: "/park/sys/permision/all/tree",
    method: "get",
  });
}

// 系统管理-角色管理-查询当前角色详情-权限和分配人数
export function getroleDetatilApi(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: "GET",
  });
}

// 系统管理-角色管理-添加角色
export function getAddroleApi(data) {
  return request({
    url: "/park/sys/role",
    method: "POST",
    data,
  });
}

// 系统管理-角色管理-删除角色
export function getDelroleApi(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: "delete",
  });
}

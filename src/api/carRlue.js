import request from "@/utils/request";

// 查看计费规则列表
export function getRlueListApi(data) {
  return request({
    url: `/parking/rule/list?page=${data.page}&pageSize=${data.pageSize}`,
    method: "get",
  });
}

// 添加计费规则
export function getAddruleApi(data) {
  return request({
    url: "/parking/rule",
    method: "POST",
    data,
  });
}

// 查看计费规则详情
export function getruleDetailApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: "get",
  });
}

// 编辑计费规则
export function getEditruleApi(data) {
  return request({
    url: "/parking/rule",
    method: "PUT",
    data,
  });
}

// 删除计费规则
export function getDelruleApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: "delete",
  });
}

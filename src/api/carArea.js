import request from "@/utils/request";

// 查看区域列表
export function getAreaListApi(data) {
  return request({
    url: `/parking/area/list?page=${data.page}&pageSize=${data.pageSize}`,
    method: "get",
  });
}

// 获取关联区域下拉列表
export function getAreaDropListApi() {
  return request({
    url: "/parking/rule/list",
    method: "get",
  });
}

// 添加区域
export function getAddAreaApi(data) {
  return request({
    url: "/parking/area",
    method: "POST",
    data,
  });
}

// 删除区域
export function getDelAreaApi(id) {
  return request({
    url: `/parking/area/${id}`,
    method: "delete",
  });
}

// 获取详情

// 编辑区域
export function getEditAreaApi(data) {
  return request({
    url: "/parking/area",
    method: "PUT",
    data,
  });
}

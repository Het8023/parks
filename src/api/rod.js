import request from "@/utils/request";

// 查看一体杆列表
export function getInfoListApi(data) {
  return request({
    url: `/pole/info/list?page=${data.page}&pageSize=${data.pageSize}&poleName=${data.poleName}&poleNumber=${data.poleNumber}&poleStatus=${data.poleStatus}`,
    method: "get",
  });
}

// 获取下拉列表
export function getDropListApi() {
  return request({
    url: "parking/area/dropList",
    method: "get",
  });
}

// 添加一体杆
export function getAddinfoApi(data) {
  return request({
    url: "/pole/info",
    method: "POST",
    data,
  });
}

// 删除区域
export function getDelInfoApi(id) {
  return request({
    url: `/pole/info/${id}`,
    method: "delete",
  });
}

// 编辑区域
export function getEditInfoApi(data) {
  return request({
    url: "/pole/info",
    method: "PUT",
    data,
  });
}

// 告警记录
// 查看告警记录列表
export function getWarningListApi(data) {
  return request({
    url: `/pole/warning/list?page=${data.page}&pageSize=${data.pageSize}&poleName=${data.poleName}&poleNumber=${data.poleNumber}&handleStatus=${data.handleStatus}`,
    method: "get",
  });
}

// 删除告警记录
export function getDelwarningApi(id) {
  return request({
    url: `/pole/warning/${id}`,
    method: "delete",
  });
}

// 查看告警详情
export function getwarningDetailAPI(id) {
  return request({
    url: `/pole/warning/${id}`,
  });
}

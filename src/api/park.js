import request from "@/utils/request";

// 楼宇列表查询
export function getBuildingApi(data) {
  return request({
    url: `/park/building?name=${data.name}&page=${data.page}&pageSize=${data.pageSize}`,
    method: "get",
  });
}

// 楼宇添加
export function getAddBuildingApi(data) {
  return request({
    url: "/park/building",
    method: "POST",
    data,
  });
}

// 楼宇删除
export function getDelBuildingApi(id) {
  return request({
    url: `/park/building/${id}`,
    method: "delete",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 楼宇详情
export function getBuildingDetailApi(id) {
  return request({
    url: `/park/building/${id}`,
    method: "get",
  });
}

// 楼宇编辑
export function getEditBuildingApi(data) {
  return request({
    url: "/park/building",
    method: "PUT",
    data,
  });
}

// 园区管理

// 企业列表
export function getenterpriseApi(data) {
  return request({
    url: `/park/enterprise?name=${data.name}&page=${data.page}&pageSize=${data.pageSize}`,
    method: "get",
  });
}

// 企业租赁信息列表-展开查看
export function getenterpriseRentApi(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: "get",
  });
}

// 添加企业
export function getAddenterpriseApi(data) {
  return request({
    url: "/park/enterprise",
    method: "POST",
    data,
  });
}

// 查询企业所属行业列表
export function getIndustryApi() {
  return request({
    url: "/park/industry",
    method: "get",
  });
}

// 上传接口
export function uploadAPI(data) {
  return request({
    url: "/upload",
    method: "POST",
    data,
  });
}

// 回填企业数据，查看详情
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
  });
}

// 编辑修改
export function updateExterpriseAPI(data) {
  return request({
    url: "/park/enterprise",
    method: "PUT",
    data,
  });
}

// 删除企业
export function delExterpriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: "DELETE",
  });
}

// 获取楼宇数据
export function getRentBuildListAPI() {
  return request({
    url: "/park/rent/building",
  });
}

// 添加续租合同
export function createRentAPI(data) {
  return request({
    url: "/park/enterprise/rent",
    method: "POST",
    data,
  });
}

// 退租
export function outRentAPI(rentId) {
  return request({
    url: `/park/enterprise/rent/${rentId}`,
    method: "PUT",
  });
}

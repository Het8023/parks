import request from "@/utils/request";

// 物业费列表
export function getPropertyfeeListApi(data) {
  return request({
    url: `/park/propertyfee?page=${data.page}&pageSize=${data.pageSize}&enterpriseName=${data.enterpriseName}&start=${data.start}&end=${data.end}`,
    method: "get",
  });
}

// 物业费-添加账单
export function getAddPropertyfeeApi(data) {
  return request({
    url: "/park/propertyfee",
    method: "POST",
    data,
  });
}

// 查询所有企业
export function getenterpriseApi() {
  return request({
    url: "/park/all/enterprise",
    method: "get",
  });
}

// 查询所有楼宇
export function getbuildingApi() {
  return request({
    url: "/park/all/building",
    method: "get",
  });
}

//物业费-预算金额
export function getpaymentApi(data) {
  return request({
    url: "/park/propertyfee/pre/payment",
    method: "POST",
    data,
  });
}

// 物业费-查看账单详情
export function getpropertyfeeDetailApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: "get",
  });
}

// 物业费-删除账单信息
export function delpropertyfeeAPI(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: "DELETE",
  });
}

import request from "@/utils/request";

// 查看停车缴费列表
export function getpaymentListApi(data) {
  return request({
    url: `/parking/payment/list?page=${data.page}&pageSize=${data.pageSize}&carNumber=${data.carNumber}&paymentStatus=${data.paymentStatus}`,
    method: "get",
  });
}

import Layout from "@/layout";
export const asyncRoutes = [
  {
    path: "/park",
    component: Layout,
    redirect: "/park/building",
    name: "park",
    permission: "park",
    alwaysShow: true,
    meta: { title: "园区管理", icon: "el-icon-office-building" },
    children: [
      {
        path: "building",
        name: "building",
        permission: "park:building",
        component: () => import("@/views/Park/Building/index"),
        meta: { title: "楼宇管理" },
      },
      {
        path: "enterprise",
        name: "enterprise",
        permission: "park:enterprise",
        component: () => import("@/views/Park/Enterprise/index"),
        meta: { title: "企业管理" },
      },
    ],
  },

  {
    path: "/car",
    component: Layout,
    redirect: "/car/table",
    name: "car",
    permission: "parking",
    alwaysShow: true,
    meta: { title: "行车管理", icon: "el-icon-guide" },
    children: [
      {
        path: "area",
        permission: "parking:area",
        component: () => import("@/views/Car/CarArea"),
        meta: { title: "区域管理" },
      },
      {
        path: "card",
        permission: "parking:card",
        component: () => import("@/views/Car/CarCard"),
        meta: { title: "月卡管理" },
      },
      {
        path: "pay",
        permission: "parking:payment",
        component: () => import("@/views/Car/CarPay"),
        meta: { title: "停车缴费管理" },
      },
      {
        path: "rule",
        permission: "parking:rule",
        component: () => import("@/views/Car/CarRule"),
        meta: { title: "计费规则管理" },
      },
    ],
  },

  {
    path: "/propety",
    component: Layout,
    // alwaysShow: true,
    permission: "park",

    children: [
      {
        path: "cost",
        name: "cost",
        permission: "park:propertyFee",
        component: () => import("@/views/Propety/Cost"),
        meta: { title: "物业费管理", icon: "form" },
      },
    ],
  },

  {
    path: "/pole",
    component: Layout,
    permission: "pole",
    alwaysShow: true,
    meta: { title: "一体杆管理", icon: "el-icon-refrigerator" },
    children: [
      {
        path: "info",
        permission: "pole:info",
        component: () => import("@/views/Rod/RodManage"),
        meta: { title: "一体杆管理" },
      },
      {
        path: "waring",
        permission: "pole:warning",
        component: () => import("@/views/Rod/RodWarn"),
        meta: { title: "告警记录" },
      },
    ],
  },
  {
    path: "/sys",
    component: Layout,
    permission: "sys",
    alwaysShow: true,
    meta: { title: "系统管理", icon: "el-icon-setting" },
    children: [
      {
        path: "user",
        permission: "sys:user",
        component: () => import("@/views/System/Employee/index"),
        meta: { title: "员工管理" },
      },
      {
        path: "role",
        permission: "sys:role",
        component: () => import("@/views/System/Role/index"),
        meta: { title: "角色管理" },
      },
    ],
  },
];

import { roleType } from "@/assets/common/utils";
import {
  Menu as IconMenu,
  Location,
  Operation,
  Briefcase,
  PhoneFilled,
} from "@element-plus/icons-vue";

export const menuConfig = [
  {
    index: "users",
    title: "用户信息",
    icon: Operation,
    subItems: [
      {
        path: "/doctor-account",
        roles: [roleType.doctor],
        title: "医生基本信息",
      },
    ],
  },
  {
    index: "patient",
    title: "患者业务",
    icon: Briefcase,
    subItems: [
      {
        path: "/patient-account",
        roles: [roleType.doctor],
        title: "患者信息导入",
      },
      {
        path: "/patient-list",
        roles: [roleType.doctor],
        title: "病历列表",
      },
      {
        path: "/apply-form",
        roles: [roleType.doctor],
        title: "病历申请",
      },
      {
        path: "/apply-list",
        roles: [roleType.doctor],
        title: "申请记录",
      },
      {
        path: "/authorize-list",
        roles: [roleType.doctor],
        title: "待审核",
      },
      {
        path: "/apply-authed-list",
        roles: [roleType.doctor],
        title: "申请通过记录",
      },
    ],
  },
  {
    index: "patient",
    title: "医生业务",
    icon: PhoneFilled,
    subItems: [
      {
        path: "/patient-account6",
        roles: [roleType.doctor],
        title: "患者列表",
      },
      {
        path: "/holder-authed-list",
        roles: [roleType.doctor],
        title: "申请待审核",
      },
      {
        path: "/doctor-account8",
        roles: [roleType.doctor],
        title: "医疗纠纷",
      },
    ],
  },
];

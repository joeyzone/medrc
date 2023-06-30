<template>
  <!-- <el-radio-group v-model="labelPosition" label="label position">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group> -->

  <div class="reg-wrapper">
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
      <el-form-item label="登录名">
        <el-input v-model="formLabelAlign.account" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="formLabelAlign.role">
          <el-option
            v-for="kname in Object.keys(roles)"
            :key="kname"
            :value="roles[kname]"
            :label="roles[kname]"
            >{{ roles[kname] }}</el-option
          >
          <!-- <el-option value="2" label="护照">护照</el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doCreate" class="reg-button"
          >创建</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { axiosClient, IDTO, IDateType } from "@/assets/common/common";
import { roleType } from "@/assets/common/utils";

const labelPosition = ref("right");
const roles: any = reactive(roleType);
const formLabelAlign = reactive({
  account: "",
  role: "",
});

axiosClient<any, IDTO<IDateType>>({
  url: "/api/get/allUsers",
  method: "GET",
});

async function doCreate() {
  const ret = await axiosClient<any, IDTO<IDateType>>({
    url: "/api/create/account",
    method: "POST",
    data: {
      account: formLabelAlign.account,
      role: formLabelAlign.role,
    },
  });
  if (ret?.success) {
    ElMessage({
      message: "创建成功",
      type: "success",
    });
  }
}
</script>
<style>
.reg-wrapper {
  width: 460px;
  margin: 20px auto;
}
.reg-button {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

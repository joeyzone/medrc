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
      <el-form-item label="账号">
        <el-input v-model="formLabelAlign.account" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formLabelAlign.pwd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doLogin" class="reg-button"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { axiosClient, IDTO, IDateType } from "@/assets/common/common";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const labelPosition = ref("right");

const formLabelAlign = reactive({
  // account: "root@zju.edu.cn",
  // pwd: "1094135dcef25b72cb7c1a0909c7c6fcdc90ccee3aa3cb623012806a3bb64a43",
  account: "",
  pwd: "",
});

async function doLogin() {
  const ret = await axiosClient<any, IDTO<IDateType>>({
    url: "/api/login",
    method: "POST",
    data: {
      account: formLabelAlign.account,
      pwd: formLabelAlign.pwd,
    },
  });
  if (ret.success) {
    ElMessage({
      message: "登录成功",
      type: "success",
    });
    const token = ret.data.token;
    window.localStorage.setItem("token", JSON.stringify(token));
    window.localStorage.setItem("account", formLabelAlign.account);
    window.localStorage.setItem("role", ret.data.role);
    store.commit("setAccountInfo", {
      account: formLabelAlign.account,
      role: ret.data.role,
    });
    router.push("/apply-list");
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

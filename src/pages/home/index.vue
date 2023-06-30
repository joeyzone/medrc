<template>
  <!-- <el-radio-group v-model="labelPosition" label="label position">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group> -->

  <div class="reg-wrapper">
    <img class="logo1" src="../../assets/img/logo2.png" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const labelPosition = ref("right");

const formLabelAlign = reactive({
  account: "",
  pwd: "",
  repwd: "",
  realname: "",
  phone: "",
  idcard: "",
  role: "",
});
</script>
<style>
.reg-wrapper {
  width: 460px;
  margin: 20px auto;
}
.logo1 {
  width: 300px;
  margin-left: 80px;
}
.reg-button {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

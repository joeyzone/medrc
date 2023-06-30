<template>
  <!-- <el-radio-group v-model="labelPosition" label="label position">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group> -->

  <div class="reg-wrapper">
    <img class="logo1" src="../../assets/img/logo2.png" />
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
      <el-form-item label="确认密码">
        <el-input v-model="formLabelAlign.repwd" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formLabelAlign.realname" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formLabelAlign.phone" />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="formLabelAlign.idcard" />
      </el-form-item>
      <el-form-item label="注册身份">
        <el-select v-model="formLabelAlign.role" placeholder="请选择身份">
          <el-option value="0" label="医生">医生</el-option>
          <el-option value="1" label="医生">患者</el-option>
          <el-option value="2" label="医生">系统管理员</el-option>
          <!-- <el-option value="3" label="医生"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="reg-button">创建</el-button>
      </el-form-item>
    </el-form>
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

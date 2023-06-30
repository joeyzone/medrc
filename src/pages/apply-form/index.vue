<template>
  <div class="apply-form-wrapper">
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      style="max-width: 460px"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="formLabelAlign.realName" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="formLabelAlign.idCard" />
      </el-form-item>
      <el-form-item label="病历号" prop="medRecId">
        <el-input v-model="formLabelAlign.medRecId" />
      </el-form-item>
      <el-form-item label="授权账号" prop="authAccount">
        <el-input v-model="formLabelAlign.authAccount" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="reg-button"
          @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { create } from "ipfs-http-client";
import { ElMessage } from "element-plus";
import type { UploadInstance, UploadUserFile } from "element-plus";

import { encryptBlobToBlob, decryptBlobToBlob } from "@/assets/common/utils";
import { setKey, getKey, axiosClient } from "@/assets/common/common";
// import CryptoJS from "crypto-js";
// import sha256 from 'crypto-js/sha256';
// import { TripleDES } from "crypto-js/tripledes";
import CryptoJS from "crypto-js";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  realName: [{ required: true, trigger: "change" }],
  idCard: [{ required: true, trigger: "change" }],
  medRecId: [{ required: true, trigger: "change" }],
  authAccount: [{ required: true, trigger: "change" }],
});

const labelPosition = ref("right");

const formLabelAlign = reactive({
  realName: null,
  idCard: null,
  medRecId: null,
  authAccount: null,
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const validRet = await formEl.validate();
  if (validRet) {
    const ret = await axiosClient({
      url: "/api/patientInfo/apply",
      method: "POST",
      data: formLabelAlign,
    });
    if (ret?.success) {
      ElMessage({
        message: "申请成功",
        type: "success",
      });
    }
    router.push("/apply-list");
  }
};
</script>

<style lang="less"></style>

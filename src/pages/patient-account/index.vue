<template>
  <!-- <el-radio-group v-model="labelPosition" label="label position">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group> -->

  <div class="reg-wrapper">
    <p>患者信息界面</p>
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      style="max-width: 460px"
      :rules="rules"
      ref="ruleFormRef"
    >
      <!-- <el-form-item label="账号">
        <el-input v-model="formLabelAlign.account" />
      </el-form-item> -->
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="formLabelAlign.realName" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formLabelAlign.phone" />
      </el-form-item>
      <el-form-item label="证件类型" prop="idType">
        <el-select v-model="formLabelAlign.idType" placeholder="">
          <el-option value="0" label="身份证">身份证</el-option>
          <el-option value="1" label="护照">护照</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号" prop="idCard">
        <el-input v-model="formLabelAlign.idCard" />
      </el-form-item>
      <el-form-item label="出生年月" prop="birthday">
        <el-date-picker
          class="date-p"
          v-model="formLabelAlign.birthday"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="病历号" prop="medRecId">
        <el-input v-model="formLabelAlign.medRecId" />
      </el-form-item>
      <el-form-item label="医保类型" prop="insType">
        <el-select v-model="formLabelAlign.insType" placeholder="">
          <el-option value="0" label="省级医保">省级医保</el-option>
          <el-option value="1" label="市级医保">市级医保</el-option>
          <el-option value="3" label="异地医保">异地医保</el-option>
          <el-option value="4" label="商业保险">商业保险</el-option>
          <el-option value="5" label="新农合">新农合</el-option>
          <el-option value="6" label="自费">自费</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户籍地" prop="paLocal">
        <el-input v-model="formLabelAlign.paLocal" />
      </el-form-item>
      <el-form-item label="现住址" prop="liveLocal">
        <el-input v-model="formLabelAlign.liveLocal" />
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contractName">
        <el-input v-model="formLabelAlign.contractName" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contractInfo">
        <el-input v-model="formLabelAlign.contractInfo" />
      </el-form-item>
      <el-form-item label="测试文件">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          ref="uploadRef"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>

          <el-button class="ml-3" type="success" @click="submitUpload">
            上传至IPFS
          </el-button>
        </el-upload>
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

const labelPosition = ref("right");

const formLabelAlign = reactive({
  // account: "",
  // pwd: "",
  realName: null,
  phone: null,
  idType: null,
  idCard: null,
  birthday: null,
  medRecId: null,
  insType: null,
  paLocal: null,
  liveLocal: null,
  contractName: null,
  contractInfo: null,
  ipfsHash: null,
});

const rules = reactive<FormRules>({
  realName: [{ required: true, trigger: "change" }],
  phone: [{ required: true, trigger: "change" }],
  idType: [{ required: true, trigger: "change" }],
  idCard: [{ required: true, trigger: "change" }],
  birthday: [{ required: true, trigger: "change" }],
  medRecId: [{ required: true, trigger: "change" }],
  insType: [{ required: true, trigger: "change" }],
  paLocal: [{ required: true, trigger: "change" }],
  liveLocal: [{ required: true, trigger: "change" }],
  contractName: [{ required: true, trigger: "change" }],
  contractInfo: [{ required: true, trigger: "change" }],
});

const fileList = ref<UploadUserFile[]>([]);

async function submitUpload() {
  if (!fileList?.value[0]?.raw) {
    return;
  }

  console.log(111, fileList?.value[0]);
  // await encryptBlobToBlob(blob, secret);
  // fileList?.value[0]?.raw
  const ret = await axiosClient({
    url: "/api/upload/encrypt-file",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file: fileList?.value[0]?.raw,
    },
  });
  formLabelAlign.ipfsHash = ret.data;
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const validRet = await formEl.validate();
  if (validRet) {
    const ret = await axiosClient({
      url: "/api/patientInfo/submit",
      method: "POST",
      data: formLabelAlign,
    });
    if (ret?.success) {
      ElMessage({
        message: "提交成功",
        type: "success",
      });
    }
    router.push("/patient-list");
  }
};
</script>
<style lang="less">
.reg-wrapper {
  width: 460px;
  margin: 20px auto;
}

.reg-button {
  width: 100%;
}
.date-p {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

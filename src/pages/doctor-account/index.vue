<template>
  <!-- <el-radio-group v-model="labelPosition" label="label position">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group> -->

  <div class="reg-wrapper">
    <p>医生信息界面</p>
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
      <el-form-item label="账号">
        <el-input v-model="formLabelAlign.account" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formLabelAlign.realname" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formLabelAlign.phone" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-select v-model="formLabelAlign.idType" placeholder="">
          <el-option value="0" label="身份证">身份证</el-option>
          <el-option value="2" label="护照">护照</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号">
        <el-input v-model="formLabelAlign.idCard" />
      </el-form-item>
      <el-form-item label="出生年月">
        <el-date-picker class="date-p" v-model="formLabelAlign.birthday" />
      </el-form-item>
      <el-form-item label="职业医师资格证">
        <el-input v-model="formLabelAlign.dorId" />
      </el-form-item>
      <el-form-item label="所属医院">
        <el-select v-model="formLabelAlign.hosType" placeholder="">
          <el-option value="0" label="省级医保">省级医保</el-option>
          <el-option value="1" label="市级医保">市级医保</el-option>
          <el-option value="2" label="异地医保">异地医保</el-option>
          <el-option value="2" label="商业保险">商业保险</el-option>
          <el-option value="2" label="新农合">新农合</el-option>
          <el-option value="2" label="自费">自费</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室">
        <el-input v-model="formLabelAlign.partType" />
      </el-form-item>
      <el-form-item label="职称">
        <el-select v-model="formLabelAlign.role" placeholder="">
          <el-option value="0" label="主任医师">主任医师</el-option>
          <el-option value="1" label="副主任医师">副主任医师</el-option>
          <el-option value="2" label="主治医师">主治医师</el-option>
          <el-option value="2" label="住院医师">住院医师</el-option>
          <el-option value="2" label="实习医师">实习医师</el-option>
          <el-option value="2" label="进修医师">进修医师</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="擅长领域">
        <el-input
          :rows="5"
          v-model="formLabelAlign.desc"
          type="textarea"
          placeholder=""
        />
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
        <el-button @click="doSubmit" type="primary" class="reg-button"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { create } from "ipfs-http-client";
import { ElMessage } from "element-plus";
import type { UploadInstance, UploadUserFile } from "element-plus";

import { encryptBlobToBlob, decryptBlobToBlob } from "@/assets/common/utils";
import { setKey, getKey, axiosClient } from "@/assets/common/common";
// import CryptoJS from "crypto-js";
// import sha256 from 'crypto-js/sha256';
// import { TripleDES } from "crypto-js/tripledes";
import CryptoJS from "crypto-js";

let ipfsClient: any;
const labelPosition = ref("right");
const isEncryptFile = true;
const isEncryptInfo = true;
const secretKey = "this is a secret key";

const formLabelAlign = reactive({
  account: "",
  // pwd: "",
  // repwd: "",
  realname: "",
  phone: "",
  idType: "",
  idCard: "",
  birthday: "",
  dorId: "",
  hosType: "",
  partType: "",
  role: "",
  desc: "",
  testFile: null,
});

const fileList = ref<UploadUserFile[]>([]);
const fileHash = ref();
let fileCid: any;

const uploadRef = ref<UploadInstance>();
// QmX4LbDjzsgkEW1R92nJFS12eHraZdAWUdDeXahLExARLm

onMounted(async () => {
  // ipfsClient = await create({
  //   host: "127.0.0.1",
  //   port: 5002,
  //   protocol: "http",
  //   apiPath: "/api/v0",
  // });
  // getKey("key11122");

  axiosClient<any, any>({
    url: "/api/get/decrypt-file",
    method: "GET",
    params: {
      fileCid: "QmPbUdi3L7Dw3ao9Ai2aeCS3w6mDyr4eGNa77Q5PWCQbfA",
    },
    responseType: "blob",
  }).then((res) => {
    const url = URL.createObjectURL(res);
    const alink = document.createElement("a");
    alink.href = url;
    alink.setAttribute("download", "12221.png");
    document.body.appendChild(alink);
    // alink.click();
  });

  // const dir = await ipfsClient.files.mkdir("/tmp");
  // console.log(await ipfsClient.ls("/tmp"));
  // for await (const file of ipfsClient.ls("/tmp")) {
  //   console.log(file.path);
  // }
  // for await (const file of ipfsClient.files.ls("/tmp")) {
  //   console.log(file.name);
  // }
  // QmQ5m4PdUTfRYpRiocyxNvJH9yegCDjhYPeAvXMJZTvusX

  // const aaaa = CryptoJS.TripleDES.encrypt("Message", "Secret_Passphrase");
  // console.log(123, CryptoJS.TripleDES.encrypt("Message", "Secret_Passphrase"));
  // console.log(
  //   222,
  //   CryptoJS.TripleDES.decrypt(aaaa, "Secret_Passphrase").toString(
  //     CryptoJS.enc.Utf8
  //   )
  // );
});

function handlePreview() {}
function handleRemove() {}

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
  fileCid = ret.data;
  if (ret?.success) {
    ElMessage({
      message: "上传成功",
      type: "success",
    });
  }

  return;
  const fileInfo = await ipfsClient?.add({
    // path: `/tmp/${fileList?.value[0].name}`,
    content:
      (isEncryptFile
        ? await encryptBlobToBlob(fileList?.value[0]?.raw, secretKey)
        : fileList?.value[0]?.raw) || "no data",
  });

  fileHash.value = fileInfo.cid.toString();
  console.log(
    "🚀 ~ fie: index.vue:175 ~ submitUpload ~ fileInfo",
    fileInfo,
    fileInfo.cid.toString()
  );

  for await (const buf of ipfsClient.cat(fileHash.value)) {
    const blob = isEncryptFile
      ? await decryptBlobToBlob(new Blob([buf]), secretKey)
      : new Blob([buf]);

    const url = URL.createObjectURL(blob);
    const alink = document.createElement("a");
    alink.href = url;
    alink.setAttribute("download", fileList?.value[0].name);
    document.body.appendChild(alink);
    alink.click();
  }
}

async function doSubmit() {
  console.log("formLabelAlign", formLabelAlign.account);
  let pkgStr = JSON.stringify({
    ...formLabelAlign,
    filePath: fileHash.value,
  });

  pkgStr = isEncryptInfo
    ? CryptoJS.RC4.encrypt(pkgStr, secretKey).toString()
    : pkgStr;
  const formInfo = await ipfsClient?.add(pkgStr);

  const stream = isEncryptInfo
    ? ipfsClient.cat(formInfo.path)
    : ipfsClient.cat(formInfo.path);
  const decoder = new TextDecoder();
  let data = "";

  for await (const chunk of stream) {
    // chunks of data are returned as a Uint8Array, convert it back to a string
    data += decoder.decode(chunk, { stream: true });
  }

  console.log("🚀 ~ file: index.vue:95 ~ doSubmit ~ cid", pkgStr);
  console.log(
    "🚀 ~ file: index.vue:204 ~ forawait ~ data",
    CryptoJS.RC4.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8)
  );
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
.date-p {
  width: 100%;
}
.el-select {
  width: 100%;
}
</style>

<template>
  <!-- <el-radio-group v-model="labelPosition" label="label position">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group> -->

  <div class="reg-wrapper">
    <p>IPFS 文件加密</p>
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
      <el-form-item label="测试文件">
        <el-upload
          v-model:file-list="fileEncryptList"
          class="upload-demo"
          ref="uploadRef"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>

          <el-button class="ml-3" type="success" @click="submitEncryptUpload">
            上传至IPFS
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <p>{{ fileEncyptCid }}</p>
    <p>
      <el-button v-if="fileEncyptCid" type="primary" @click="getEncryptFile"
        >查看/下载</el-button
      >
    </p>

    <p>IPFS 文件无加密</p>
    <el-form
      :label-position="labelPosition"
      label-width="120px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
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
    </el-form>
    <p>{{ fileCid }}</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { create } from "ipfs-http-client";
import { UploadInstance, UploadUserFile, ElMessage } from "element-plus";
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

const formLabelAlign = reactive({});

const fileList = ref<UploadUserFile[]>([]);
const fileEncryptList = ref<UploadUserFile[]>([]);
const fileHash = ref();
let fileCid = ref("");
let fileEncyptCid = ref("");

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

async function getEncryptFile() {
  axiosClient<any, any>({
    url: "/api/get/decrypt-file",
    method: "GET",
    params: {
      fileCid: fileEncyptCid.value,
    },
    responseType: "blob",
  }).then((res) => {
    const url = URL.createObjectURL(res);
    const alink = document.createElement("a");
    alink.href = url;
    alink.setAttribute("download", "12221.png");
    document.body.appendChild(alink);
    alink.click();
  });
}

async function submitEncryptUpload() {
  console.log(
    "🚀 ~ file: index.vue:146 ~ submitEncryptUpload ~ fileList?.value[0]:",
    fileEncryptList?.value[0]
  );
  if (!fileEncryptList?.value[0]?.raw) {
    return;
  }

  console.log(111, fileEncryptList?.value[0]);
  // await encryptBlobToBlob(blob, secret);
  // fileList?.value[0]?.raw
  const ret = await axiosClient({
    url: "/api/upload/encrypt-file",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file: fileEncryptList?.value[0]?.raw,
    },
  });
  if (ret?.success) {
    ElMessage({
      message: "上传成功",
      type: "success",
    });
  }
  fileEncyptCid.value = ret.data;

  return;
  // 下面是客户端直接连接ipfs服务代码
  // 由于需要授权业务，所以这部分业务不适合在客户端做
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

async function submitUpload() {
  if (!fileList?.value[0]?.raw) {
    return;
  }

  console.log(111, fileList?.value[0]);
  // await encryptBlobToBlob(blob, secret);
  // fileList?.value[0]?.raw
  const ret = await axiosClient({
    url: "/api/upload/file",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file: fileList?.value[0]?.raw,
    },
  });
  if (ret?.success) {
    ElMessage({
      message: "上传成功",
      type: "success",
    });
  }
  fileCid.value = ret.data;

  return;
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

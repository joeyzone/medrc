<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="realName" label="姓名" width="180" />
      <el-table-column prop="idCard" label="证件号" width="180" />
      <el-table-column prop="medRecId" label="病历号" width="180" />
      <el-table-column prop="authAccount" label="授权者" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { create } from "ipfs-http-client";

import { encryptBlobToBlob, decryptBlobToBlob } from "@/assets/common/utils";
import { setKey, getKey, axiosClient } from "@/assets/common/common";
let tableData = ref([]);
onMounted(async () => {
  const ret = await axiosClient<any, IDTO<IDateType>>({
    url: "/api/patientInfo/getSelfApplyList",
    method: "GET",
  });
  if (ret?.success) {
    tableData.value = ret.data.list;
  }
});
</script>

<style lang="less"></style>

<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="account" label="Account" width="180" />
      <el-table-column prop="pwd" label="Password" />
      <el-table-column prop="role" label="Role" width="180" />
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
    url: "/api/get/allUsers",
    method: "GET",
  });
  if (ret?.success) {
    tableData.value = ret.data.list;
  }
});
</script>

<style lang="less"></style>

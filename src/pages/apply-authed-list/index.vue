<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="realName" label="姓名" width="180" />
      <el-table-column prop="idCard" label="证件号" width="180" />
      <el-table-column prop="medRecId" label="病历号" width="180" />
      <el-table-column prop="authAccount" label="授权者" />
      <!-- <el-table-column prop="shareArr" label="files" /> -->
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button
            v-for="shareKey in scope.row.shareArr"
            :key="shareKey"
            size="small"
            @click="handleView(scope.$index, scope.row, shareKey)"
            >查看</el-button
          >
        </template>
      </el-table-column>
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
    url: "/api/patientInfo/getApplyerChecked",
    method: "GET",
  });
  if (ret?.success) {
    const tempArr = [];
    ret.data?.list.forEach((ele) => {
      const patientInfo = JSON.parse(ele?.patientInfo);
      patientInfo.shareArr = ele.shareArr;
      tempArr.push(patientInfo);
    });

    tableData.value = tempArr;
  }
});

const handleView = async (_index, row, shareKey) => {
  // shareKey authAccount
  const ret = await axiosClient<any, IDTO<IDateType>>({
    url: "/api/apply/filesInfo",
    method: "POST",
    data: {
      authAccount: row.authAccount,
      shareKey,
    },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(ret);
  const alink = document.createElement("a");
  alink.href = url;
  alink.setAttribute("download", "12221.png");
  document.body.appendChild(alink);
  alink.click();
};
</script>

<style lang="less"></style>

<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="realName" label="姓名" width="180" />
      <el-table-column prop="idCard" label="证件号" width="180" />
      <el-table-column prop="medRecId" label="病历号" width="180" />
      <el-table-column prop="applyAccount" label="申请者" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            @click.prevent="submitAuth(scope.$index, scope.row)"
          >
            授权
          </el-button>
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
    url: "/api/patientInfo/getApplyCheckList",
    method: "GET",
  });
  if (ret?.success) {
    tableData.value = ret.data.list;
  }
});

async function submitAuth(_index, row) {
  const ipfsHashArray = row.ipfsHashArray;
  const ret = await axiosClient<any, IDTO<IDateType>>({
    url: "/api/auth-agree/token",
    method: "POST",
    data: {
      ipfsHashArray,
      applyAccount: row.applyAccount,
      idCard: row.idCard,
      realName: row.realName,
    },
  });
  if (ret?.success) {
    tableData.value = ret.data.list;
  }
}
</script>

<style lang="less"></style>

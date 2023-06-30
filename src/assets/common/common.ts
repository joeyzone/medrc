import axios, { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";
import { create } from "ipfs-http-client";
import { encryptBlobToBlob, decryptBlobToBlob } from "@/assets/common/utils";

export let ipfsClient: any = null;

export interface IDateType {
  [key: string]: any;
}

export interface IDTO<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": "no-cache",
    token: window.localStorage.getItem("token"),
  },
  timeout: 15 * 1000,
});

axiosClient.interceptors.response.use((res) => {
  if (res.data?.success === false) {
    ElMessage.error(res.data.message);
  }
  if (res.status === 200) {
    return res.data;
  }
  return res;
});

export const getIpfsClient = async () => {
  ipfsClient = await create({
    host: "127.0.0.1",
    port: 5002,
    protocol: "http",
    apiPath: "/api/v0",
  });

  return ipfsClient;
};

const uploadIPFS = async (fileList: any, isEncryptFile: boolean) => {
  if (!fileList?.value[0]?.raw) {
    return;
  }

  const ret = await axiosClient({
    url: "/api/upload/file",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file: fileList?.value[0]?.raw,
      isEncryptFile,
    },
  });

  return ret;
};

export const setKey = async (key: string, value: string) => {
  const ret = await axiosClient({
    url: "/api/setKey",
    method: "POST",
    data: {
      key,
      value,
    },
  });
};

export const getKey = async (key: string) => {
  const ret = await axiosClient({
    url: "/api/getKey",
    method: "GET",
    params: {
      key,
    },
  });
};

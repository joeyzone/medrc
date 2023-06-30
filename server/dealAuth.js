import express from "express";
import { createClient } from "redis";
import bodyParser from "body-parser";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import * as randomatic from "randomatic";
import { create } from "ipfs-http-client";
import multer from "multer";
import formData from "form-data";
import { Blob } from "node:buffer";
import {
  encryptBlobToBlobServer,
  decryptBlobToBlobServer,
} from "@/assets/common/utils";
import fs from "fs";
import path from "path";
import * as filesAPI from "./dealFiles";
// 用于加解密token的秘钥，一般储存于加密机中
const tokenSecret = "this is a secret token";

export const install = (app, client, checkRole, roleType) => {
  app.post(
    "/api/patientInfo/submit",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const postData = req.body;
      const { idCard, medRecId, ipfsHash } = postData;
      const { account } = req.token;
      if (!ipfsHash) {
        return res.json({
          success: false,
          data: null,
          message: "ipfsHash empty",
        });
      }
      await client.set(
        `patient-${idCard}-${medRecId}-${account}-${ipfsHash}-${Date.now()}`,
        JSON.stringify(postData)
      );

      res.json({
        success: true,
        data: {},
      });
    }
  );

  //
  app.post(
    "/api/patientInfo/apply",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const postData = req.body;
      const { account } = req.token;
      const { idCard, medRecId, realName, authAccount } = postData;

      // await client.get(
      //   `patient-${idCard}-${medRecId}-${ipfsHash}-${Date.now()}`,
      //   JSON.stringify(postData)
      // );
      const ipfsHashArray = [];
      for await (const key of client.scanIterator({
        TYPE: "string",
        MATCH: `patient-${idCard}-${medRecId}*`,
      })) {
        const ret = await client.get(key);
        const retObj = JSON.parse(ret);
        ipfsHashArray.push(retObj.ipfsHash);
      }
      // waitcheck-myaccount-toaccount : idCard, medRecId, realName, hash Arrry
      const setObj = {
        idCard,
        medRecId,
        realName,
        authAccount,
        ipfsHashArray,
      };
      await client.set(
        `waitcheck-${account}-${authAccount}-${idCard}`,
        JSON.stringify(setObj)
      );

      res.json({
        success: true,
        data: ipfsHashArray,
      });
    }
  );

  // 获取病历列表
  app.get(
    "/api/patientInfo/list",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { account } = req.token;
      const retArr = [];
      // waitcheck-myaccount-toaccount : idCard, medRecId, realName, hash Arrry
      for await (const key of client.scanIterator({
        TYPE: "string",
        MATCH: `patient-*-*-${account}-*`,
      })) {
        //  是自己的病人
        const ret = await client.get(key);
        const retObj = JSON.parse(ret);
        retArr.push(retObj);
      }
      res.json({
        success: true,
        data: {
          list: retArr,
        },
      });
    }
  );

  // 获取自己的申请列表
  app.get(
    "/api/patientInfo/getSelfApplyList",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { account } = req.token;
      const retArr = [];
      // waitcheck-myaccount-toaccount : idCard, medRecId, realName, hash Arrry
      for await (const key of client.scanIterator({
        TYPE: "string",
        MATCH: `waitcheck-${account}-*`,
      })) {
        const ret = await client.get(key);
        const retObj = JSON.parse(ret);
        retArr.push(retObj);
      }
      res.json({
        success: true,
        data: {
          list: retArr,
        },
      });
    }
  );

  // 获取待审核的列表
  app.get(
    "/api/patientInfo/getApplyCheckList",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { account } = req.token;
      const retArr = [];
      // waitcheck-myaccount-toaccount : idCard, medRecId, realName, hash Arrry
      for await (const key of client.scanIterator({
        TYPE: "string",
        MATCH: `waitcheck-*-${account}-*`,
      })) {
        const ret = await client.get(key);
        const applyAccount = key.split("-")[1];
        const retObj = JSON.parse(ret);
        retObj.applyAccount = applyAccount;
        retArr.push(retObj);
      }
      res.json({
        success: true,
        data: {
          list: retArr,
        },
      });
    }
  );

  // applyer 获取审核通过的列表
  app.get(
    "/api/patientInfo/getApplyerChecked",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { account } = req.token;
      const retArr = [];
      // waitcheck-myaccount-toaccount : idCard, medRecId, realName, hash Arrry
      for await (const key of client.scanIterator({
        TYPE: "string",
        MATCH: `authed-${account}-*`,
      })) {
        const ret = await client.get(key);
        const retObj = JSON.parse(ret);
        retArr.push(retObj);
      }
      res.json({
        success: true,
        data: {
          list: retArr,
        },
      });
    }
  );

  // applyer 获取审核通过的列表
  app.get(
    "/api/patientInfo/getAuthChecked",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { account } = req.token;
      const retArr = [];
      // waitcheck-myaccount-toaccount : idCard, medRecId, realName, hash Arrry
      for await (const key of client.scanIterator({
        TYPE: "string",
        MATCH: `authed-*-${account}-*`,
      })) {
        const ret = await client.get(key);
        const retObj = JSON.parse(ret);
        retArr.push(retObj);
      }
      res.json({
        success: true,
        data: {
          list: retArr,
        },
      });
    }
  );

  // 申请
  app.post(
    "/api/apply/share",
    checkRole([roleType.doctor]),
    async (req, res) => {
      // applyInfoKey 由 AES 加密 account-ipfsHash，减少一次redis查询
      const { applyInfoKey } = req.body;
      const { account } = req.token;
      // 解密 applyInfoKey
      const holdAccount = CryptoJS.AES.encrypt(applyInfoKey, tokenSecret)
        .toString()
        .split("-")[0];

      // 加入持有者待审批列表
      const holdTodoKey = `${holdAccount}-${applyInfoKey}`;
      client.set(holdTodoKey, `${account}-${applyInfoKey}`);

      // 加入申请者待审批列表
      const applyTodoKey = `${account}-${applyInfoKey}`;
      // 申请者: 王二 申请内容: XXXX 状态: 等待 shareKey 无
      client.set(
        applyTodoKey,
        JSON.stringify({
          account,
          applyInfoKey,
          status: "waiting",
          shareKey: null,
        })
      );

      res.json({
        success: true,
        data: null,
      });
    }
  );

  // 同意申请
  app.post(
    "/api/auth-agree/token",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { applyAccount, ipfsHashArray, idCard, realName } = req.body;
      const tokenData = req.token;
      const holdAccount = tokenData.account;
      const retValue = JSON.parse(await client.get(`users-${holdAccount}`));
      if (!retValue.pwd) {
        return res.json({ success: false, data: null, message: "unknow" });
      }
      // 用 holder 秘钥加密 ipfsHashArray
      const shareArr = [];
      ipfsHashArray.forEach((ele) => {
        const shareKey = CryptoJS.AES.encrypt(ele, retValue.pwd).toString();
        shareArr.push(shareKey);
      });

      // const deShreadArr = [];
      // shareArr.forEach((skey) => {
      //   const deret = CryptoJS.AES.decrypt(skey, retValue.pwd).toString(
      //     CryptoJS.enc.Utf8
      //   );
      //   deShreadArr.push(deret);
      // });

      // console.log("🚀 ~ file: index.js:259 ~ deret:", deShreadArr, retValue.pwd);

      // 删除待授权列表
      const waitingKey = `waitcheck-${applyAccount}-${holdAccount}-${idCard}`;
      const patientInfo = await client.get(waitingKey);
      client.del(waitingKey);
      console.log("🚀 ~ file: index.js:276 ~ waitingKey:", waitingKey);

      // 持有者：
      const authedKey = `authed-${applyAccount}-${holdAccount}-${idCard}`;
      client.set(
        authedKey,
        JSON.stringify({
          patientInfo,
          shareArr,
        })
      );
      console.log("🚀 ~ file: index.js:272 ~ authedKey:", authedKey);

      res.json({
        success: true,
        data: {
          patientInfo,
          authedKey,
        },
      });
    }
  );

  // todo 拒绝申请，直接删除 appylist 此条数据

  // 请求数据
  // 专门给 applyer
  // 传参 shareArr, authAccount
  app.post(
    "/api/apply/filesInfoTest",
    checkRole([roleType.doctor]),
    async (req, res) => {
      // applyInfoKey 李医生-病人张三-XXX
      const { applyInfoKey, shareKey } = req.body;
      const { account } = req.token;
      const holderAccount = applyInfoKey.split("-")[0];
      if (account === holderAccount) {
        // 持有者，直接获取
        const holderInfo = JSON.parse(
          await client.get(`users-${holderAccount}`)
        );
        // 持有者，直接用applyInfoKey
        const enCryptedInfo = JSON.parse(await client.get(applyInfoKey));
        // 用自己 pwd 解密
        const deCryptedInfo = CryptoJS.AES.decrypt(
          enCryptedInfo,
          holderInfo.pwd
        ).toString();
      } else {
        // 不是持有者， 并且没获得授权（没有shareKey）
        if (!shareKey) {
          return res.json({
            success: false,
            data: null,
            message: "no key",
          });
        }

        // 不是持有者， 但有shareKey
        const holderInfo = JSON.parse(
          await client.get(`users-${holderAccount}`)
        );
        // 解密出  applyInfoKey
        const sharedApplyInfoKey = CryptoJS.AES.decrypt(
          shareKey,
          holderInfo.pwd
        ).toString();
        // 申请的文件与授权的文件不一致，判断为恶意请求
        if (sharedApplyInfoKey !== applyInfoKey) {
          return res.json({
            success: false,
            data: null,
            message: "not authorized key",
          });
        }
        // 用 applyInfoKey 拿信息
        const enCryptedInfo = JSON.parse(await client.get(sharedApplyInfoKey));
        // 用 holder pwd 服务端解密 文件内容
        const deCryptedInfo = CryptoJS.AES.decrypt(
          enCryptedInfo,
          holderInfo.pwd
        ).toString();
        // 解密成功 返回
      }
    }
  );

  // 生成病人信息
  app.post(
    "/api/create/patient",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const patientInfo = req.body;
      const { account } = req.token;
      // const { pwd } = JSON.parse(await client.get(account))
      const dpKey = `myPatient-${account}-${patientInfo.idCard}-${patientInfo.medRecId}`;
      // const encryptedInfo = CryptoJS.AES.encrypt(JSON.stringify(patientInfo), pwd);
      client.set(dpKey, JSON.stringify(patientInfo));
      return res.json({
        success: true,
        data: null,
      });
    }
  );

  // todo 文件关联病人
  app.post(
    "/api/create/patient",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { ipfsHash } = req.body;
      const { account } = req.token;

      return res.json({
        success: true,
        data: null,
      });
    }
  );

  // 请求数据
  // 专门给 applyer
  // 传参 shareArr, authAccount
  app.post(
    "/api/apply/filesInfo",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { shareKey, authAccount } = req.body;
      const tokenData = req.token;

      const holderInfo = JSON.parse(await client.get(`users-${authAccount}`));

      const fileCid = CryptoJS.AES.decrypt(shareKey, holderInfo.pwd).toString(
        CryptoJS.enc.Utf8
      );

      const buff = await filesAPI.getDecryptAESFile(fileCid, holderInfo.pwd);
      res.send(buff);
    }
  );

  app.post(
    "/api/apply/selfFilesInfo",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { fileCid } = req.body;
      const tokenData = req.token;
      const holderInfo = JSON.parse(
        await client.get(`users-${tokenData.account}`)
      );
      console.log("🚀 ~ file: dealAuth.js:435 ~ tokenData:", holderInfo.pwd);
      const buff = await filesAPI.getDecryptAESFile(fileCid, holderInfo.pwd);
      res.send(buff);
    }
  );
};

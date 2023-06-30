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
// 用于加解密token的秘钥，一般储存于加密机中
const tokenSecret = "this is a secret token";

export const install = (app, client, checkRole, roleType) => {
  app.post("/api/login", async (req, res) => {
    const { account, pwd: inputPWD } = req.body;
    const retValueStr = await client.get(`users-${account}`);
    if (!retValueStr) {
      return res.json({
        success: false,
        data: null,
        message: "account or pwd error",
      });
    }

    const { pwd, role } = JSON.parse(retValueStr);
    if (inputPWD !== pwd) {
      // 密码错误
      return res.json({ success: false, data: null, message: "pwd error" });
    } else {
      // 返回token
      let jsonStr = JSON.stringify({
        account,
        role,
        timestamp: Date.now(), // 加入时间戳或者随机数，可防止重入攻击
      });

      jsonStr = CryptoJS.AES.encrypt(jsonStr, tokenSecret).toString();
      res.json({
        success: true,
        data: {
          token: jsonStr,
          role,
        },
      });
    }
  });
  // 临时接口，此工作应该由DBA完成，用完后删除
  app.post("/api/create/root", async (req, res) => {
    // role 角色 root
    const account = "root@zju.edu.cn";
    // 'this is a root' sha256
    const pwd =
      "1094135dcef25b72cb7c1a0909c7c6fcdc90ccee3aa3cb623012806a3bb64a43";
    const role = roleType.root;
    const jsonData = JSON.stringify({
      account,
      pwd,
      role,
    });

    await client.set(`users-${account}`, jsonData);
    res.json({ success: true, data: null });
  });
  // 由root用户分配，无需注册过程
  app.post(
    "/api/create/account",
    checkRole([roleType.root]),
    async (req, res) => {
      // role 角色
      const { account, role } = req.body;
      if (!account || !role) {
        return res.json({
          success: false,
          data: null,
          message: "params empty",
        });
      }

      const pwd = randomatic.default("Aa0!", 16);
      const jsonData = JSON.stringify({
        account,
        pwd,
        role,
      });
      const ret = await client.get(`users-${account}`);
      if (ret) {
        return res.json({
          success: false,
          data: null,
          message: "already created",
        });
      }
      await client.set(`users-${account}`, jsonData);
      // const ulistStr = await client.get("all-users");
      // const ulist = JSON.parse(ulistStr);
      // ulist.push({
      //   account,
      //   createTime: Date.now(),
      // });
      // await client.set("all-users", JSON.stringify(ulist));
      res.json({
        success: true,
        data: {
          account,
          pwd,
        },
      });
    }
  );
  // 获取所有用户账户
  app.get("/api/get/allUsers", checkRole([roleType.root]), async (req, res) => {
    const tempArr = [];
    for await (const key of client.scanIterator({
      TYPE: "string",
      MATCH: "users-*",
    })) {
      const ret = await client.get(key);
      const retObj = JSON.parse(ret);
      if (retObj.role === roleType.root) {
        tempArr.unshift(retObj);
      } else {
        tempArr.push(retObj);
      }
    }

    return res.json({
      success: true,
      data: {
        list: tempArr,
      },
    });
  });

  //   test
  app.post("/api/setKey", async (req, res) => {
    const { key, value } = req.body;
    await client.set(key, value);
    res.json({ success: true, data: value });
  });
  //   test
  app.get("/api/getKey", checkRole([roleType.doctor]), async (req, res) => {
    const { key } = req.query;
    const retValue = await client.get(key);
    res.json({ success: true, data: retValue });
  });
};

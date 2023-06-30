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
import * as usersAPI from "./dealUsers";
import * as authAPI from "./dealAuth";

const iv = "8053a59622e614ac";
// redis-cli KEYS "prefix:*" | xargs redis-cli DEL
// 用于加解密token的秘钥，一般储存于加密机中
const tokenSecret = "this is a secret token";

const roleType = {
  root: "root",
  manager: "manager",
  doctor: "doctor",
};

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

// 事先检查token, 与业务逻辑解耦
const checkRole = (needRoles) => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, data: null, msg: "no token" });
    }
    // header 默认加了引号，很难发现
    const tokenStr = CryptoJS.AES.decrypt(
      token.replace(/"/g, ""),
      tokenSecret
    ).toString(CryptoJS.enc.Utf8);

    const tokenData = JSON.parse(tokenStr);
    if (!tokenData.account) {
      return res.json({ success: false, data: "Invalid token" });
    }

    const retValueStr = await client.get(`users-${tokenData.account}`);
    if (!retValueStr) {
      return res.json({ success: false, data: "not user" });
    }
    const retValueObj = JSON.parse(retValueStr);

    if (!needRoles || needRoles.length === 0) {
      next();
      return;
    }
    if (
      needRoles.includes(retValueObj.role) ||
      retValueObj.role === roleType.root
    ) {
      req.token = tokenData;
      next();
    } else {
      return res.json({ success: false, data: "not role" });
    }
  };
};

const app = express();
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

filesAPI.install(app, client, checkRole, roleType);
usersAPI.install(app, client, checkRole, roleType);
authAPI.install(app, client, checkRole, roleType);

export const handler = app;

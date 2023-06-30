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

const iv = "8053a59622e614ac";

const ipfsClient = await create({
  host: "127.0.0.1",
  port: 5002,
  protocol: "http",
  apiPath: "/api/v0",
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

export const install = (app, client, checkRole, roleType) => {
  app.post("/api/upload/file", upload.single("file"), async (req, res) => {
    const { cid } = await ipfsClient.add({ content: req.file.buffer });
    return res.json({
      success: true,
      data: cid.toString(),
    });
  });

  app.get("/api/get/file", async (req, res) => {
    const { fileCid } = req.query;

    // let blob;
    let buf1;
    for await (const buf of ipfsClient.cat(fileCid)) {
      // blob = new Blob([buf]);
      buf1 = buf;
    }
    // res.setHeader("Content-Length", file.length);
    res.write(buf1, "binary");
    res.end();
  });

  app.post(
    "/api/upload/encrypt-file",
    upload.single("file"),
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { account } = req.token;
      const retValueStr = await client.get(`users-${account}`);
      if (!retValueStr) {
        return res.json({ success: false, data: "not user" });
      }
      const retValueObj = JSON.parse(retValueStr);
      // await encryptBlobToBlob(req.file.buffer, secretKey);

      // const { cid } = await ipfsClient.add({
      //   content: await (
      //     await encryptBlobToBlobServer(req.file.buffer, retValueObj.pwd)
      //   ).toString(),
      // });
      // return res.json({
      //   success: true,
      //   data: cid.toString(),
      // });

      const file = req.file;
      const buff = file.buffer;
      const ebuff = encryptAES(buff, retValueObj.pwd);

      const content = Buffer.concat([Buffer.from(ebuff, "utf8")]);
      const { cid } = await ipfsClient.add({ content });
      return res.json({
        success: true,
        data: cid.toString(),
      });
    }
  );

  app.get(
    "/api/get/decrypt-file",
    checkRole([roleType.doctor]),
    async (req, res) => {
      const { fileCid } = req.query;

      let buf1;

      const { account } = req.token;
      const retValueStr = await client.get(`users-${account}`);
      if (!retValueStr) {
        return res.json({ success: false, data: "not user" });
      }
      const retValueObj = JSON.parse(retValueStr);
      // await decryptBlobToBlob(new Blob([buf]), secretKey)
      let edata;
      for await (const buf of ipfsClient.cat(fileCid)) {
        // buf1 = buf;
        // edata.push(buf);
        edata = buf.toString("utf8");
      }
      // const econtent = Buffer.concat(edata);
      const ebuf = Buffer.from(edata, "hex");
      const content = decryptAES(ebuf, retValueObj.pwd);
      const buff = Buffer.from(content, "hex");
      // res.write(content, "binary");
      // res.end();
      // fs.writeFile("./ds.png", buff, function (err) {
      //   if (err) throw err;
      // });
      console.log("contents:", content.length, "encrypted:", buff.length);
      res.send(buff);
    }
  );
};

function encryptAES(buffer, secretKey) {
  // const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
  // console.log("🚀 ~ file: index.js:557 ~ encryptAES ~ iv:", iv);
  const key = crypto
    .createHash("sha256")
    .update(String(secretKey))
    .digest("base64")
    .substr(0, 32);
  console.log("🚀 ~ file: index.js:563 ~ encryptAES ~ key:", key);
  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
  const data = cipher.update(buffer);
  const encrypted = Buffer.concat([data, cipher.final()]);
  return encrypted.toString("hex");
}

function decryptAES(buffer, secretKey) {
  const key = crypto
    .createHash("sha256")
    .update(String(secretKey))
    .digest("base64")
    .substr(0, 32);
  console.log("🚀 ~ file: index.js:495 ~ decryptAES ~ key:", key);
  const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
  const data = decipher.update(buffer);
  const decrpyted = Buffer.concat([data, decipher.final()]);
  return decrpyted;
}

export const getDecryptAESFile = async (fileCid, pwd) => {
  let edata;
  for await (const buf of ipfsClient?.cat(fileCid)) {
    // buf1 = buf;
    // edata.push(buf);
    edata = buf.toString("utf8");
  }
  const ebuf = Buffer.from(edata, "hex");
  const content = decryptAES(ebuf, pwd);
  const buff = Buffer.from(content, "hex");
  return buff;
};

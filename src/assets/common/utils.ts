import CryptoJS from "crypto-js";

export const roleType = {
  manager: "机构管理员",
  doctor: "医生",
};

export async function encryptBlobToBlob(
  blob: Blob,
  secret: string
): Promise<Blob> {
  const wordArray = CryptoJS.lib.WordArray.create(await blob.arrayBuffer());
  const result = CryptoJS.AES.encrypt(wordArray, secret);
  return new Blob([result.toString()]);
}
export async function decryptBlobToBlob(
  blob: Blob,
  secret: string
): Promise<Blob> {
  const decryptedRaw = CryptoJS.AES.decrypt(await blob.text(), secret);
  return new Blob([wordArrayToByteArray(decryptedRaw)]);
}

export async function encryptBlobToBlobServer(
  buf: number[],
  secret: string
): Promise<CryptoJS.lib.CipherParams> {
  const wordArray = CryptoJS.lib.WordArray.create(buf);
  const result = CryptoJS.AES.encrypt(wordArray, secret);
  return result;
}

export async function decryptBlobToBlobServer(
  buf: CryptoJS.lib.CipherParams,
  secret: string
): Promise<CryptoJS.lib.WordArray> {
  const decryptedRaw = CryptoJS.AES.decrypt(buf, secret);
  return decryptedRaw;
}

export function wordToByteArray(word: number, length: number) {
  const ba = [];
  const xFF = 0xff;
  if (length > 0) ba.push(word >>> 24);
  if (length > 1) ba.push((word >>> 16) & xFF);
  if (length > 2) ba.push((word >>> 8) & xFF);
  if (length > 3) ba.push(word & xFF);

  return ba;
}

export function wordArrayToByteArray({
  words,
  sigBytes,
}: {
  sigBytes: number;
  words: number[];
}) {
  const result = [];
  let bytes;
  let i = 0;
  while (sigBytes > 0) {
    bytes = wordToByteArray(words[i], Math.min(4, sigBytes));
    sigBytes -= bytes.length;
    result.push(bytes);
    i++;
  }
  return new Uint8Array(result.flat());
}

// async function main() {
//   const secret = "bbbb";
//   const blob = new Blob(["1".repeat(1e3)]);
//   const encryptedBlob = await encryptBlobToBlob(blob, secret);
//   console.log("enrypted blob size", encryptedBlob.size);
//   const decryptedBlob = await decryptBlobToBlob(encryptedBlob, secret);
//   console.log("decryptedBlob", decryptedBlob);
//   console.log(await decryptedBlob.text());
// }
// main();

const fileInfo = await ipfsClient?.add({
// path: `/tmp/${fileList?.value[0].name}`,
content:
(isEncryptFile
? await encryptBlobToBlob(fileList?.value[0]?.raw, secretKey)
: fileList?.value[0]?.raw) || "no data",
});

fileHash.value = fileInfo.cid.toString();
console.log(
"🚀 ~ fie: index.vue:175 ~ submitUpload ~ fileInfo",
fileInfo,
fileInfo.cid.toString()
);

for await (const buf of ipfsClient.cat(fileHash.value)) {
const blob = isEncryptFile
? await decryptBlobToBlob(new Blob([buf]), secretKey)
: new Blob([buf]);

    const url = URL.createObjectURL(blob);
    const alink = document.createElement("a");
    alink.href = url;
    alink.setAttribute("download", fileList?.value[0].name);
    document.body.appendChild(alink);
    alink.click();

}

 // == Use this when you need to migrate from cloudinary to backblaze == 


 

// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import fs from "fs";

// // S3 client for Backblaze
// const s3 = new S3Client({
//   region: "eu-central-003", 
//   endpoint: process.env.B2_ENDPOINT, 
//   credentials: {
//     accessKeyId: process.env.B2_KEY_ID,
//     secretAccessKey: process.env.B2_APP_KEY,
//   },
// });

// const uploadOnBackblaze = async (localFilePath, bucketName, folder = "uploads") => {
//   try {
//     if (!localFilePath) return null;

//     const fileContent = fs.readFileSync(localFilePath);
//     const fileName = `${folder}/${Date.now()}-${localFilePath.split("/").pop()}`;

//     await s3.send(
//       new PutObjectCommand({
//         Bucket: bucketName,
//         Key: fileName,
//         Body: fileContent,
//       })
//     );

//     fs.unlinkSync(localFilePath);

//     // Public URL (Backblaze S3 style)
//     const fileUrl = `${process.env.B2_ENDPOINT}/${bucketName}/${fileName}`;

//     return { fileName, url: fileUrl };
//   } catch (error) {
//     console.error("Backblaze upload error:", error.message || error);
//     if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//     return null;
//   }
// };

// const deleteFromBackblaze = async (fileUrl, bucketName) => {
//   try {
//     if (!fileUrl) throw new Error("URL is required");

//     // extract the key after bucket name
//     const urlParts = new URL(fileUrl);
//     const key = urlParts.pathname.split("/").slice(2).join("/"); // skip /bucket-name/

//     await s3.send(
//       new DeleteObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//       })
//     );

//     return true;
//   } catch (error) {
//     console.error("Backblaze deletion error:", error.message || error);
//     throw new Error("Failed to delete file from Backblaze");
//   }
// };

// export { uploadOnBackblaze, deleteFromBackblaze };

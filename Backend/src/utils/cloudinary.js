import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath,folder="uploads") => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folder,
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

const deleteFromCloudinary = async (url, folderPath = "") => {
  try {
    if (!url) {
      throw new Error("URL is required to delete a file from Cloudinary");
    }

    // Extract the public ID from the Cloudinary URL
    const urlParts = url.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1]; // last part
    const publicIdOnly = publicIdWithExtension.split(".")[0]; // without extension

    if (!publicIdOnly) {
      throw new Error("Unable to extract public ID from the URL");
    }

    // Construct full public ID
    const fullPublicId = folderPath ? `${folderPath}/${publicIdOnly}` : publicIdOnly;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message || error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

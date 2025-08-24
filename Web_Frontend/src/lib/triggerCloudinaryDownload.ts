const triggerCloudinaryDownload = (url: string, filename: string) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Inject `fl_attachment:<filename>` after `upload/` (Cloudinary's delivery type)
    const uploadIndex = pathParts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1) {
      pathParts.splice(uploadIndex + 1, 0, `fl_attachment:${filename}`);
      urlObj.pathname = pathParts.join("/");
      window.open(urlObj.toString(), "_blank"); // or use window.location.href = ...
    } else {
      console.error("Invalid Cloudinary URL format");
    }
  } catch (err) {
    console.error("Failed to build download URL:", err);
  }
}

export default triggerCloudinaryDownload;
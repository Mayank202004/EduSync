import imageCompression from "browser-image-compression";

/**
 * Compresses an image Blob using browser-image-compression
 * @param blob - The original image blob
 * @param maxSizeMB - Maximum size in MB (default 1 MB)
 * @param maxWidthOrHeight - Max width or height in pixels (default 800)
 * @returns A Promise that resolves with the compressed image blob
 */
export async function compressImage(
  blob: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 800
): Promise<Blob> {
  try {
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };

    const compressedBlob = await imageCompression(blob, options);
    return compressedBlob;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw error;
  }
}

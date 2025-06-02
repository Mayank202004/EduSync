import { makeAspectCrop, centerCrop, type Crop } from "react-image-crop";

/**
 * Checks if the image dimensions are below the required minimum.
 *
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @param min_dimension - Minimum required width and height in pixels.
 * @returns True if either width or height is less than the minimum.
 */
export const isValidImageSize = (
  width: number,
  height: number,
  min_dimension: number
): boolean => {
  return width < min_dimension || height < min_dimension;
};

/**
 * Generates a centered square crop of the given image,
 * with the crop being at least `min_dimension` in both width and height.
 *
 * @param image - HTMLImageElement to base crop from.
 * @param min_dimension - Minimum width/height in pixels for crop.
 * @returns A centered crop object.
 */
export const generateCenteredCrop = (
  image: HTMLImageElement,
  min_dimension: number,
  aspect_ratio: number = 1
): Crop => {
  const { width, height } = image;
  const cropWidthInPercent = (min_dimension / width) * 100;

  const initialCrop = makeAspectCrop(
    {
      unit: "%",
      width: cropWidthInPercent,
    },
    aspect_ratio,
    width,
    height
  );

  return centerCrop(initialCrop, width, height);
};

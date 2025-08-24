//taken from: https://github.com/nikitadev-yt/react-image-cropper

import { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import { convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import toast from "react-hot-toast";

import setCanvasPreview from "@/lib/setCanvasPreview";
import { compressImage } from "@/utils/imageUtils";
import { cn } from "@/lib/cn";
import { isValidImageSize, generateCenteredCrop } from "@/utils/imageUtils";
import userIconWhite from "@/assets/user_icon_white.png";
import SimpleButton from "@/components/UI/SimpleButton";
import OutlinedButton from "@/components/Chat/OutlinedButton";

import { updateAvatarApi } from "@/services/profileService";

const MIN_DIMENSION = 200;

const PhotoPreview = ({ avatar }) => {
  const [imageName, setImageName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const imageRef = useRef(null);
  const canvasPreviewRef = useRef(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  //the actual image painted will have smaller dimensions compared to original so
  //this will set the minimum width of 200px x 200px crop relative to painted image in browser
  const minCropWidth =
    (MIN_DIMENSION / imageRef.current?.naturalWidth) * imageRef.current?.width;

  const handleComplete = (c) => {
    if (
      !imageRef.current ||
      !canvasPreviewRef.current ||
      !c?.width ||
      !c?.height
    )
      return;
    setCanvasPreview(imageRef.current, canvasPreviewRef.current, c);

    // Convert canvas to blob
    canvasPreviewRef.current.toBlob(
      (blob) => {
        if (blob) {
          setCroppedBlob(blob);
        }
      },
      "image/jpeg",
      0.8 // quality
    );
  };

  const selectImage = (event) => {
    setShowPreview(false);

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image(); //creating an image object to check its height and width
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (isValidImageSize(naturalWidth, naturalHeight, MIN_DIMENSION)) {
          toast.error("Insufficient image size.");
          setImageSrc(null);
          setImageName("");
        } else {
          setImageName(file.name);
          setImageSrc(imageUrl);
        }
      });
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (event) => {
    const centeredCrop = generateCenteredCrop(
      event.currentTarget,
      MIN_DIMENSION
    );
    setCrop(centeredCrop);
    handleComplete(crop);
  };

  const previewCroppedImage = () => {
    setShowPreview(true);
    setCanvasPreview(
      imageRef.current,
      canvasPreviewRef.current,
      convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height)
    );
  };

  const updateProfileAvatar = async () => {
    setIsUpdating(true);

    await (async () => {
      try {
        const tempFormData = new FormData();
        if (!croppedBlob) throw new Error("Cropped image not loaded");
        //compress if new image was selected
        const compressedBlob = await compressImage(croppedBlob);
        tempFormData.append("avatar", compressedBlob);

        const apiCall = async () => updateAvatarApi(tempFormData);
        const response = await toast.promise(apiCall, {
          loading: "Updating profile...",
          success: "Profile updated successfully",
          error: "Failed to update profile",
        });

        if (response.statusCode < 200 || response.statusCode > 299) {
          toast.error(response.error || "Something went wrong while updating.");
        }

        // Reload only on success
        setTimeout(() => window.location.reload(), 200);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        toast.error(message);
      }
    })();

    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 border-1 mx-auto py-6 px-6 sm:px-10 md:px-15 rounded-sm">
        <div
          className={cn(
            "container flex items-center justify-center border w-fit h-fit mx-auto my-3 bg-gray-700 relative",
            "min-w-" + MIN_DIMENSION
          )}
        >
          {!imageSrc ? (
            avatar ? (
              <img src={avatar} alt="" />
            ) : (
              <img src={userIconWhite} className={`size-48 p-3`} />
            )
          ) : (
            <>
              <ReactCrop
                crop={crop}
                onChange={(_, pr) => setCrop(pr)}
                circularCrop
                keepSelection
                aspect={1}
                minWidth={minCropWidth}
                onComplete={handleComplete}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Upload"
                  style={{ maxHeight: "70vh" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>

              {/* Canvas Preview (always rendered but shown/hidden using styles) */}
              <div
                className={cn(
                  "absolute flex items-center justify-center inset-0 bg-gray-400",
                  { hidden: !showPreview }
                )}
              >
                <canvas
                  ref={canvasPreviewRef}
                  className="rounded-full object-contain border border-black"
                  style={{
                    width: MIN_DIMENSION,
                    height: MIN_DIMENSION,
                  }}
                />
              </div>
            </>
          )}
        </div>

        {imageSrc && crop ? (
          <div className="size-fit mx-auto space-x-2">
            <OutlinedButton
              buttonProps={{
                type: "button",
                onClick: () => setShowPreview(false),
              }}
              className={
                !showPreview
                  ? "dark:bg-blue-800/30 bg-blue-50 dark:text-white text-blue-600 border-blue-300"
                  : "text-gray-500 border-transparent"
              }
            >
              Crop
            </OutlinedButton>
            <OutlinedButton
              buttonProps={{ type: "button", onClick: previewCroppedImage }}
              className={
                showPreview
                  ? "dark:bg-blue-800/30 bg-blue-50 dark:text-white text-blue-600 border-blue-300"
                  : "text-gray-500 border-transparent"
              }
            >
              Preview
            </OutlinedButton>
          </div>
        ) : null}

        <label className="grid grid-cols-[0_1fr_auto] grid-rows-2 w-full cursor-pointer">
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            name="avatar"
            className="size-[1px] col-fit"
            onChange={selectImage}
          />
          <span className="w-full border-1 py-1.5 px-3 col rounded-sm truncate hover:ring-1">
            {imageName === "" ? "No file chosen" : imageName}
          </span>
          <span className="min-w-max border-1 py-1.5 px-3 ml-2 rounded-sm text-blue-400 border-blue-500 font-semibold hover:bg-blue-50 dark:hover:bg-blue-700/30 hover:ring-1">
            Choose file
          </span>
          <span className="w-full leading-4 text-gray-500 dark:text-gray-400 col-span-full mt-1.5">
            Image should be atleast {MIN_DIMENSION}px x {MIN_DIMENSION}px
          </span>
        </label>
      </div>
      <SimpleButton
        buttonProps={{
          type: "submit",
          onClick: updateProfileAvatar,
          disabled: !crop,
        }}
        className="disabled:opacity-50"
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </SimpleButton>
    </div>
  );
};

export default PhotoPreview;

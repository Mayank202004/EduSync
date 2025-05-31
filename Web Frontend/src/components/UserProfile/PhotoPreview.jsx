//taken from: https://github.com/nikitadev-yt/react-image-cropper

import ReactCrop from "react-image-crop";
import toast from "react-hot-toast";
import {
  makeAspectCrop,
  centerCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import userIconWhite from "@/assets/user_icon_white.png";
import setCanvasPreview from "./setCanvasPreview";
import { cn } from "@/lib/utils";

const MIN_DIMENSION = 256;

const isValidImageSize = (width, height) => {
  return width < MIN_DIMENSION || height < MIN_DIMENSION;
};

const generateCenteredCrop = (image, min_dimension) => {
  const { width, height } = image;
  const cropWidthInPercent = (min_dimension / width) * 100;

  const crop = makeAspectCrop(
    {
      unit: "%",
      width: cropWidthInPercent,
    },
    1,
    width,
    height
  );

  return centerCrop(crop, width, height);
};

const CustomButton = ({ text, condition, callback }) => {
  return (
    <button
      type="button" //important to have it as button as it is part of a form
      className={cn(
        "cursor-pointer py-1.5 px-4 rounded-sm border transition-colors",
        condition
          ? "bg-blue-50 text-blue-600 border-blue-300"
          : "text-gray-500 border-transparent"
      )}
      onClick={callback}
    >
      {text}
    </button>
  );
};

const PhotoPreview = ({ user, onBlobReady }) => {
  const [imageName, setImageName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const imageRef = useRef(null);
  const canvasPreviewRef = useRef(null);

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
        if (blob && onBlobReady) {
          onBlobReady(blob);
        }
      },
      "image/jpeg",
      0.8 // quality
    );
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image(); //creating an image object to check its height and width
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (isValidImageSize(naturalWidth, naturalHeight)) {
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

  return (
    <div className="w-[90%] sm:w-[85%] flex flex-col gap-5 border-1 mx-auto mb-10 py-6 px-6 sm:px-10 md:px-15 rounded-sm">
      <div className="container flex items-center justify-center min-w-2xs border w-fit h-fit mx-auto my-3 bg-gray-700 relative">
        {!imageSrc ? (
          user?.avatar ? (
            <img src={user?.avatar} alt="" />
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
              minWidth={MIN_DIMENSION}
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
                { "hidden": showPreview }
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
          <CustomButton
            text="Crop"
            condition={showPreview}
            callback={previewCroppedImage}
            />
          <CustomButton
            text="Preview"
            condition={!showPreview}
            callback={() => setShowPreview(false)}
          />
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
  );
};

export default PhotoPreview;

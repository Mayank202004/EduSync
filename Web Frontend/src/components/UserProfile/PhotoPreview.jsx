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

const MIN_DIMENSION = 256;

const PhotoPreview = ({ user }) => {
  const [imageName, setImageName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const imageRef = useRef(null);
  const canvasPreviewRef = useRef(null);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
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

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <div className="w-[90%] sm:w-[85%] flex flex-col gap-5 border-1 mx-auto mb-10 py-6 px-6 sm:px-10 md:px-15 rounded-sm">
      <div className="container flex items-center justify-center min-w-2xs border w-fit h-fit mx-auto my-3 bg-gray-700 relative">
        {!imageSrc ? (
          user.avatar ? (
            <img src={user.avatar} alt="" />
          ) : (
            <img
              src={userIconWhite}
              className={`size-[${MIN_DIMENSION}px] p-3`}
            />
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
            <div className={`absolute flex items-center justify-center inset-0 bg-gray-400 ${
                showPreview ? "" : "hidden"
              }`}>

            <canvas
              ref={canvasPreviewRef}
              className="rounded-full"
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: 256,
                height: 256,
              }}
            />
            </div>
          </>
        )}
      </div>

      {imageSrc && crop ? (
        <div className="size-fit mx-auto space-x-2">
          <button
            className={`cursor-pointer py-1.5 px-4 rounded-sm border transition-colors
                        ${
                          !showPreview
                            ? "bg-blue-50 text-blue-600 border-blue-300"
                            : "text-gray-500 border-transparent"
                        }`}
            onClick={() => setShowPreview(false)}
          >
            Crop
          </button>
          <button
            className={`cursor-pointer py-1.5 px-4 rounded-sm border transition-colors
                        ${
                          showPreview
                            ? "bg-blue-50 text-blue-600 border-blue-300"
                            : "text-gray-500 border-transparent"
                        }`}
            onClick={() => {
              setShowPreview(prev => !prev)
              setCanvasPreview(
                imageRef.current,
                canvasPreviewRef.current,
                convertToPixelCrop(
                  crop,
                  imageRef.current.width,
                  imageRef.current.height
                )
              );
            }}
          >
            Preview
          </button>
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
        <span className="w-full border-1 py-1.5 px-3 col rounded-sm truncate">
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

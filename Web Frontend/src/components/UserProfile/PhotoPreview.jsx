import ReactCrop from "react-image-crop";
import userIconWhite from "@/assets/user_icon_white.png"

const PhotoPreview = ({ user }) => {
  return (
    <div className="w-[90%] sm:w-[85%] flex flex-col gap-5 border-1 mx-auto mb-10 py-6 px-6 sm:px-10 md:px-15 rounded-sm">
      <div className="container flex justify-center min-w-2xs border size-fit mx-auto my-6 bg-gray-700">
        {user.avatar ? <img src={user.avatar} alt="" /> : <img src={userIconWhite} className="size-[200px] p-3"/>}
      </div>
      <label className="flex w-full gap-2.5 cursor-pointer">
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          name="avatar"
          className="size-[1px]"
        />
        <span className="w-full border-1 py-1.5 px-3 rounded-sm">
          No file chosen
        </span>
        <span className="min-w-max border-1 py-1.5 px-3 rounded-sm text-blue-400 border-blue-500 font-semibold hover:bg-blue-50 dark:hover:bg-blue-700/30 hover:ring-1">
          Choose file
        </span>
      </label>
    </div>
  );
};

export default PhotoPreview;

import axiosInstance from "@/api/axiosInstance";

const updateUserApi = async (username, fullName, avatarFormData = null) => {
  const userDataRes = await axiosInstance.put("/users/update", {
    username,
    fullName,
  });

  console.log("invoked", avatarFormData.get("avatar"));

  let avatarDataRes;
  if (avatarFormData) {
    avatarDataRes = await axiosInstance.put(
      "/users/update-avatar",
      avatarFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  return { userDataRes, avatarDataRes };
};

export default updateUserApi;

import axiosInstance from "@/api/axiosInstance";

export const updateUserApi = async (username, fullName) => {
  const response = await axiosInstance.put("/users/update", {
    username,
    fullName,
  });

  return response.data;
};

export const updateAvatarApi = async (avatarFormData) => {
  const response = await axiosInstance.put(
    "/users/update-avatar",
    avatarFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

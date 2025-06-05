import axiosInstance from "@/api/axiosInstance";

/**
 * Updates the user profile information such as username or full name.
 *
 * @param {Object} data - The user data to be updated.
 * @param {string} data.username - The new username.
 * @param {string} data.fullName - The new full name.
 * @returns {Promise<Object>} The updated user profile data.
 * @throws Will throw an error if the update fails.
 */
export const updateUserApi = async (data) => {
  const response = await axiosInstance.put("/users/update", data);
  return response.data;
};

/**
 * Updates the user's avatar/profile picture.
 *
 * @param {FormData} avatarFormData - Form data containing the avatar file.
 *   It should include a file field, e.g., `avatarFormData.append("avatar", file)`.
 * @returns {Promise<Object>} The updated avatar response.
 * @throws Will throw an error if the avatar update fails.
 */
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
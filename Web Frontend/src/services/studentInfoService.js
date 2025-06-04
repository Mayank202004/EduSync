import axiosInstance from "@/api/axiosInstance";

export const getStudentInfo = async () => {
  const response = await axiosInstance.get("/student/me");
  return response.data;
};

export const addSiblingInfoApi = async (data) => {
  const response = await axiosInstance.post("/student/sibling-details", data);
  return response.data;
};

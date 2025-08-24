import axiosInstance from "@/api/axiosInstance";

export const getAllFaqs = async () => {
  const response = await axiosInstance.get("/faq/category/fee");
  return response.data;
};

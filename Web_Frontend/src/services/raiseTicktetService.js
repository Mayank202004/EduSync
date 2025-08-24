import axiosInstance from "@/api/axiosInstance";

export const createTicket = async (data) => {
  const response = axiosInstance.post("/ticket", data);
  return response.data;
};

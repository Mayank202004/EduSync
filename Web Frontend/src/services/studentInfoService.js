import axiosInstance from "@/api/axiosInstance";

export const getStudentInfo = async () => {
	const response = await axiosInstance.get("/student/me");
	return response.data
};

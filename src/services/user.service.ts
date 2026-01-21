// services/user.service.ts
import axiosClient from "@/lib/axios";

export const userService = {
  async getProfile() {
    try {
      const res = await axiosClient.get("/api/user/me");
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        return null; // user chưa login
      }
      throw err;
    }
  },
};

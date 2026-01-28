// services/auth.service.ts
import axiosClient from "@/client/lib/axios";
import { authStore } from "@/client/lib/auth-store";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  fullName: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const res = await axiosClient.post("/api/auth/login", payload);
    authStore.setToken(res.data.data.access_token);
    return res.data.data;
  },

  async signup(payload: SignupPayload) {
    const res = await axiosClient.post("/api/auth/signup", payload);
    authStore.setToken(res.data.data.access_token);
    return res.data.data;
  },

  async logout() {
    await axiosClient.post("/api/auth/logout");
    authStore.clear();
  },

  async refresh() {
    const res = await axiosClient.post("/api/auth/refresh");
    authStore.setToken(res.data.data.access_token);
    return res.data.data;
  },
};

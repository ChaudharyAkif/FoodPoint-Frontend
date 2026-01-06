
import {type CheckRoleResponse, type LoginRequest, type LoginResponse } from "../types/auth.types";
import axiosInstance from "./axiosInstance";


export const loginApi = (data: LoginRequest) => {
  return axiosInstance.post<LoginResponse>("/auth/login", data);
};


export const checkRoleApi = (email: string) => {
  return axiosInstance.post<CheckRoleResponse>("/auth/check-role", { email });
};


export const forgetPasswordApi = (email: string) => {
  return axiosInstance.post("/auth/forget-password", { email });
};


export const verifyTokenApi = () => {
  return axiosInstance.get("/auth/verify");
};


export const refreshTokenApi = () => {
  return axiosInstance.post("/auth/refresh");
};


export const resetPasswordApi = (token: string, newPassword: string) => {
  return axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
};



export const verifyResetTokenApi = (token: string) => {
  return axiosInstance.get(`/auth/reset-password/verify/${token}`);
};



export const getCashiersApi = () =>
  axiosInstance.get("/auth/cashiers");

export const getCashierByIdApi = (id: string) =>
  axiosInstance.get(`/auth/cashiers/${id}`);

export const updateCashierApi = (id: string, data: any) =>
  axiosInstance.put(`/auth/cashiers/${id}`, data);

export const deleteCashierApi = (id: string) =>
  axiosInstance.delete(`/auth/cashiers/${id}`);

import axios from "axios";
import { getToken } from "./auth";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000")
  .trim()
  .replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getMenuItems = async (params = {}) => {
  const response = await api.get("/menu", {
    params,
  });

  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await api.post("/menu", data);
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await api.put(`/menu/${id}`, data);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export const loginOwner = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};
export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, {
    status,
  });

  return response.data;
};
export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post("/uploads/image", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};


export default api;
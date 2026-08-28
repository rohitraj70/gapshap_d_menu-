import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gapshap_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("gapshap_admin_token");
      localStorage.removeItem("gapshap_admin_user");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Public
export const fetchCategories = () => api.get("/categories");
export const fetchMenu = (params) => api.get("/menu", { params });
export const fetchMenuItem = (id) => api.get(`/menu/${id}`);
export const fetchMenuByCategory = (categoryId) => api.get(`/menu/category/${categoryId}`);

// Auth
export const loginAdmin = (payload) => api.post("/auth/login", payload);
export const getMe = () => api.get("/auth/me");

// Admin categories
export const createCategory = (payload) => api.post("/categories", payload);
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Admin menu items (multipart when image included)
export const createMenuItem = (formData) =>
  api.post("/menu", formData);
export const updateMenuItem = (id, formData) =>
  api.put(`/menu/${id}`, formData);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

export default api;

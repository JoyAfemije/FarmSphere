import api from "./axios";

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getAdminAll: (params) => api.get("/products/admin/all", { params }),
  create: (formData) => api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (id, publicId) => api.delete(`/products/${id}/image`, { data: { publicId } }),
};

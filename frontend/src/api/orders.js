import api from "./axios";

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get("/orders/admin", { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getStats: () => api.get("/orders/admin/stats"),
};

import API from "./axiosConfig";

export const getRequests = () => API.get("/requests");
export const getRequestById = (id) => API.get(`/requests/${id}`);
export const createRequest = (data) => API.post("/requests", data);
export const updateRequest = (id, data) => API.put(`/requests/${id}`, data);
export const updateStatus = (id, data) => API.patch(`/requests/${id}/status`, data);
export const deleteRequest = (id) => API.delete(`/requests/${id}`);

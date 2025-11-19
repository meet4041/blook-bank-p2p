import API from "./axiosConfig";

export const getDonors = () => API.get("/donors");
export const getDonorById = (id) => API.get(`/donors/${id}`);
export const createDonor = (data) => API.post("/donors", data);
export const updateDonor = (id, data) => API.put(`/donors/${id}`, data);
export const deleteDonor = (id) => API.delete(`/donors/${id}`);

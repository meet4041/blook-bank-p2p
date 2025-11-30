import { BASE_URL, getAuthHeaders, handleResponse } from './apiClient';

export const getDonors = async () => {
    const res = await fetch(`${BASE_URL}/donors`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    
    return result;
};

export const getDonorById = async (id) => {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    return result;
};

export const createDonor = async (data) => {
    const res = await fetch(`${BASE_URL}/donors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    return result;
};

export const updateDonor = async (id, data) => {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    return result;
};

export const deleteDonor = async (id) => {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    return result;
};

export const verifyDonor = async (id) => {
    const res = await fetch(`${BASE_URL}/donors/${id}/verify`, {
        method: 'PATCH', //
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
};
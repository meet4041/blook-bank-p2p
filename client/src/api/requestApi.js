import { BASE_URL, getAuthHeaders, handleResponse } from './apiClient';

export const getRequests = async () => {
    const res = await fetch(`${BASE_URL}/requests`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    
    return result;
};

export const getRequestById = async (id) => {
    const res = await fetch(`${BASE_URL}/requests/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    return result;
};

export const createRequest = async (data) => {
    const res = await fetch(`${BASE_URL}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    return result;
};

export const updateRequest = async (id, data) => {
    const res = await fetch(`${BASE_URL}/requests/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    return result;
};

export const updateStatus = async (id, data) => {
    const res = await fetch(`${BASE_URL}/requests/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    return result;
};

export const deleteRequest = async (id) => {
    const res = await fetch(`${BASE_URL}/requests/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const result = await handleResponse(res);
    return result;
};
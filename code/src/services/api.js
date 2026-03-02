// Central API service — all backend calls go through here

const BASE_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res) => {
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error?.message || 'Request failed');
    }
    return data;
};

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const authApi = {
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
        });
        const data = await handleResponse(res);
        if (data.data?.token) {
            localStorage.setItem('token', data.data.token);
        }
        return data.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    me: async () => {
        const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
        return handleResponse(res);
    },
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const categoriesApi = {
    list: async () => {
        const res = await fetch(`${BASE_URL}/categories`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.data;
    },

    create: async (payload) => {
        const res = await fetch(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    update: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    delete: async (id) => {
        const res = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── DIAGNOSTICS ─────────────────────────────────────────────────────────────

export const diagnosticsApi = {
    list: async (params = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page);
        if (params.limit) query.set('limit', params.limit);
        if (params.search) query.set('search', params.search);
        if (params.categoryId) query.set('categoryId', params.categoryId);
        if (params.minPrice) query.set('minPrice', params.minPrice);
        if (params.maxPrice) query.set('maxPrice', params.maxPrice);

        const res = await fetch(`${BASE_URL}/diagnostics?${query}`, { headers: getHeaders() });
        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(`${BASE_URL}/diagnostics/${id}`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.data;
    },

    create: async (payload) => {
        const res = await fetch(`${BASE_URL}/diagnostics`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    update: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/diagnostics/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    delete: async (id) => {
        const res = await fetch(`${BASE_URL}/diagnostics/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── SURGICAL ────────────────────────────────────────────────────────────────

export const surgicalApi = {
    list: async (params = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page);
        if (params.limit) query.set('limit', params.limit);
        if (params.search) query.set('search', params.search);
        if (params.categoryId) query.set('categoryId', params.categoryId);
        if (params.minPrice) query.set('minPrice', params.minPrice);
        if (params.maxPrice) query.set('maxPrice', params.maxPrice);
        if (params.complexity) query.set('complexity', params.complexity);
        if (params.riskLevel) query.set('riskLevel', params.riskLevel);

        const res = await fetch(`${BASE_URL}/surgical?${query}`, { headers: getHeaders() });
        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(`${BASE_URL}/surgical/${id}`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.data;
    },

    create: async (payload) => {
        const res = await fetch(`${BASE_URL}/surgical`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    update: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/surgical/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    delete: async (id) => {
        const res = await fetch(`${BASE_URL}/surgical/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── CLINICS ─────────────────────────────────────────────────────────────────

export const clinicsApi = {
    list: async (params = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page);
        if (params.limit) query.set('limit', params.limit);
        if (params.search) query.set('search', params.search);
        if (params.status) query.set('status', params.status);
        if (params.region) query.set('region', params.region);
        if (params.type) query.set('type', params.type);
        const res = await fetch(`${BASE_URL}/clinics?${query}`, { headers: getHeaders() });
        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(`${BASE_URL}/clinics/${id}`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.data;
    },

    create: async (payload) => {
        const res = await fetch(`${BASE_URL}/clinics`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    update: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/clinics/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    updateStatus: async (id, status, rejectionReason) => {
        const res = await fetch(`${BASE_URL}/clinics/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status, rejectionReason }),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    delete: async (id) => {
        const res = await fetch(`${BASE_URL}/clinics/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export const adminApi = {
    getProfile: async () => {
        const res = await fetch(`${BASE_URL}/admin/profile`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.data;
    },

    updateProfile: async (payload) => {
        const res = await fetch(`${BASE_URL}/admin/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    updatePassword: async (payload) => {
        const res = await fetch(`${BASE_URL}/admin/password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    getNotifications: async () => {
        const res = await fetch(`${BASE_URL}/admin/notifications`, { headers: getHeaders() });
        const data = await handleResponse(res);
        return data.data;
    },

    markNotificationAsRead: async (id) => {
        const res = await fetch(`${BASE_URL}/admin/notifications/${id}/read`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        const data = await handleResponse(res);
        return data.data;
    },

    markAllNotificationsAsRead: async () => {
        const res = await fetch(`${BASE_URL}/admin/notifications/read-all`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        const data = await handleResponse(res);
        return data.data;
    },
};

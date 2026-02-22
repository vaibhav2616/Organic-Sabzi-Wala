import axios from 'axios';

// Dynamic API URL: Automatically uses 'localhost' or valid Network IP based on where the user is visiting from.
const getBaseURL = () => {
    const host = window.location.hostname;
    if (host === 'localhost' || host.startsWith('192.168.')) {
        return `http://${host}:8000/api/`;
    }
    // Production Fallback: Use relative URL by default, or provide absolute URL via VITE_API_URL
    return '/api/';
};

const baseURL = import.meta.env.VITE_API_URL || getBaseURL();

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Auth (Future Proofing for Phase 4 integration)
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    // Skip auth header for OTP endpoints to avoid 401s with stale tokens
    const isAuthEndpoint = config.url?.includes('auth/otp/');

    if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;

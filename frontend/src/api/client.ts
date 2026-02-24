import axios from 'axios';

// Dynamic API URL: Automatically uses local dev or production Render URL
const getBaseURL = () => {
    // .env.production (Vercel build) has VITE_API_URL set to the Render URL
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL as string;
    }
    const host = window.location.hostname;
    if (host === 'localhost' || host.startsWith('192.168.') || host.startsWith('10.')) {
        return `http://${host}:8000/api/`;
    }
    // Production fallback (Vercel without env var)
    return 'https://organic-sabzi-wala-api.onrender.com/api/';
};

const baseURL = getBaseURL();

const client = axios.create({
    baseURL,
    timeout: 90000, // 90s — Render free tier cold starts can take 60-90s
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Auth
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    // Skip auth header for public product/category endpoints
    const isPublicEndpoint =
        config.url?.includes('/products') ||
        config.url?.includes('/categories') ||
        config.url?.includes('proxy/') ||
        config.url?.includes('auth/otp/');

    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;

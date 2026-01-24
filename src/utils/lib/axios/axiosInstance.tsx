import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        // We will store the token in localStorage with key 'accessToken'
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and other errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized or specific token errors
        if (
            error.response &&
            (error.response.status === 401 ||
                error.response.data?.code === 'token_not_valid')
        ) {
            // Check if it's strictly a token expiry issue or just bad credentials
            // (Optional: refine this check based on exact backend error structure)

            // Clear local storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                // Redirect to login with a flag
                // We use window.location to ensure a full refresh/state reset
                // and to work outside of React components (like here in a utility file)
                // Avoid infinite loops if already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login?sessionExpired=true';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

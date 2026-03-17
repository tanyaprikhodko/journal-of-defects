import { toast } from 'react-toastify';
import { getApiUrl } from '../config';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const refreshToken = async (): Promise<string | null> => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (!refreshTokenValue) {
        return null;
    }

    try {
        const response = await fetch(`${getApiUrl()}/Authentication/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });

        if (response.ok) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await response.json();

            if (newAccessToken) {
                localStorage.setItem('accessToken', newAccessToken);
            }
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }

            return newAccessToken;
        } else {
            // Refresh token is invalid or expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('departmentId');
            return null;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('departmentId');
        return null;
    }
};

const redirectToLogin = () => {
    toast.error('Сесія закінчилася. Будь ласка, увійдіть знову');

    // Clear auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('departmentId');

    // Redirect to login page
    window.location.href = '/login';
};

/**
 * Enhanced fetch wrapper that handles session expiration and token refresh
 */
export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = localStorage.getItem('accessToken');

    // Add authorization header if token exists
    const headers = {
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    // Make the initial request
    let response = await fetch(url, { ...options, headers });

    // If response is 401 (Unauthorized), attempt token refresh
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            const newToken = await refreshToken();
            isRefreshing = false;

            if (newToken) {
                // Token refreshed successfully, notify subscribers
                onRefreshed(newToken);

                // Retry the original request with new token
                const newHeaders = {
                    ...options.headers,
                    'Authorization': `Bearer ${newToken}`,
                };
                response = await fetch(url, { ...options, headers: newHeaders });
            } else {
                // Token refresh failed, redirect to login
                redirectToLogin();
                throw new Error('Session expired');
            }
        } else {
            // Token refresh is already in progress, wait for it
            const newToken = await new Promise<string>((resolve) => {
                addRefreshSubscriber((token: string) => {
                    resolve(token);
                });
            });

            // Retry with the new token
            const newHeaders = {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`,
            };
            response = await fetch(url, { ...options, headers: newHeaders });
        }
    }

    return response;
};

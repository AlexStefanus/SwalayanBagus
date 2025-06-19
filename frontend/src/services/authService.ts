import { LoginCredentials, RegisterData, User } from '@types-shared';

const API_URL = '/api/auth';

export const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login gagal.');
    }
    return response.json();
};

export const register = async (userData: RegisterData): Promise<void> => {
    const newUserPayload = { ...userData, role: 'customer' as const };
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserPayload),
    });
    if (!response.ok) {
        throw new Error('Gagal mendaftar.');
    }
};
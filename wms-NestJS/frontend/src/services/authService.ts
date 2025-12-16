import axios from 'axios';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface AuthResponse {
	accessToken: string;
}

const TOKEN_KEY = 'wms_token';

class AuthService {
	async signIn(username: string, password: string): Promise<AuthResponse> {
		const response = await axios.post<AuthResponse>(`${API_URL}/auth/signInUser`, {
			username,
			password,
		});
		this.setToken(response.data.accessToken);
		return response.data;
	}

	async signUp(username: string, password: string): Promise<AuthResponse> {
		const response = await axios.post<AuthResponse>(`${API_URL}/auth/signUpUser`, {
			username,
			password,
		});
		this.setToken(response.data.accessToken);
		return response.data;
	}

	getToken(): string | null {
		return localStorage.getItem(TOKEN_KEY);
	}

	setToken(token: string): void {
		localStorage.setItem(TOKEN_KEY, token);
	}

	removeToken(): void {
		localStorage.removeItem(TOKEN_KEY);
	}

	isAuthenticated(): boolean {
		const token = this.getToken();
		if (!token) return false;

		try {
			const parts = token.split('.');
			if (parts.length !== 3) return false;

			const payload = JSON.parse(atob(parts[1]));
			return payload.exp * 1000 > Date.now();
		} catch (e) {
			console.error('Token validation error:', e);
			return false;
		}
	}

	logout(): void {
		this.removeToken();
	}

	getAuthHeader(): Record<string, string> {
		const token = this.getToken();
		return token ? { Authorization: `Bearer ${token}` } : {};
	}
}

export const authService = new AuthService();
export default authService;

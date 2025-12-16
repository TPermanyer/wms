import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface Ubication {
	ubication_id: number;
	hallway: string;
	position: number;
	height: number;
	depth: number;
	productUbicationList?: { amount: number; product_id: number }[];
}

class UbicationService {
	async getAllUbications(): Promise<Ubication[]> {
		const response = await axios.post<Ubication[]>(
			`${API_URL}/ubication/getAllUbications`,
			{},
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async createUbication(ubication: Omit<Ubication, 'ubication_id' | 'code'>): Promise<Ubication> {
		const response = await axios.post<Ubication>(
			`${API_URL}/ubication/createUbication`,
			ubication,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async updateUbication(ubication: Partial<Ubication> & { ubication_id: number }): Promise<Ubication> {
		const response = await axios.post<Ubication>(
			`${API_URL}/ubication/modifyUbicationById`,
			ubication,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async deleteUbication(ubicationId: number): Promise<void> {
		await axios.post(
			`${API_URL}/ubication/deleteUbicationById`,
			{ ubication_id: ubicationId },
			{ headers: authService.getAuthHeader() }
		);
	}
}

export const ubicationService = new UbicationService();
export default ubicationService;

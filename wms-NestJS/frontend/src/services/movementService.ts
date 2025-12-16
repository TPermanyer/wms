import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface MovementLog {
	movement_log_id: number;
	user_id: number;
	from_ubication_id: number | null;
	to_ubication_id: number | null;
	product_id: number;
	batch_id: number;
	amount: number;
	timestamp: string;
	userEntity?: {
		id: number;
		username: string;
	};
	productEntity?: {
		product_id: number;
		reference: string;
		description: string;
	};
	fromUbicationEntity?: {
		ubication_id: number;
		hallway: string;
		position: number;
		height: number;
		depth: number;
	};
	toUbicationEntity?: {
		ubication_id: number;
		hallway: string;
		position: number;
		height: number;
		depth: number;
	};
}

class MovementService {
	async getAllMovementLogs(): Promise<MovementLog[]> {
		const response = await axios.post<MovementLog[]>(
			`${API_URL}/movement-log/getAllMovementLogs`,
			{},
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}
}

export const movementService = new MovementService();
export default movementService;

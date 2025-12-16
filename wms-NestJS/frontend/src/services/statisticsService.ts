import axios from 'axios';
import authService from './authService';

import { ProductUbication } from './productUbicationService';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface DashboardStats {
	totalUbications: number;
	occupiedUbications: number;
	occupancyPercentage: number;
	totalProducts: number;
	totalBatches: number;
	totalStockItems: number;
}

class StatisticsService {
	async getDashboardStats(): Promise<DashboardStats> {
		const response = await axios.get<DashboardStats>(
			`${API_URL}/statistics/dashboard`,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async getExpiringProducts(): Promise<ProductUbication[]> {
		const response = await axios.get<ProductUbication[]>(
			`${API_URL}/statistics/expiring-products`,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}
}

export const statisticsService = new StatisticsService();
export default statisticsService;

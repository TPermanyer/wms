import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface Batch {
	batch_id: number;
	batch: string;
	expiry_date: string;
	product_id: number;
}

class BatchService {
	async getAllBatches(): Promise<Batch[]> {
		const response = await axios.post<Batch[]>(
			`${API_URL}/batch/getAllBatches`,
			{},
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async getBatchesByProductId(productId: number): Promise<Batch[]> {
		const response = await axios.post<Batch[]>(
			`${API_URL}/batch/getAllBatchesByProductId`,
			{ product_id: productId },
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async createBatch(batch: { batch: string; product_id: number; expiry_date: string }): Promise<Batch> {
		const response = await axios.post<Batch>(
			`${API_URL}/batch/createBatch`,
			batch,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async updateBatch(batch: Partial<Batch> & { batch_id: number }): Promise<Batch> {
		const response = await axios.post<Batch>(
			`${API_URL}/batch/modifyBatchById`,
			batch,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async deleteBatch(batchId: number): Promise<void> {
		await axios.post(
			`${API_URL}/batch/deleteBatchById`,
			{ batch_id: batchId },
			{ headers: authService.getAuthHeader() }
		);
	}
}

export const batchService = new BatchService();
export default batchService;

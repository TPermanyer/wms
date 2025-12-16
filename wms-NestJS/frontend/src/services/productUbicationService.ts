import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface ProductUbication {
	product_ubication_id: number;
	product_id: number;
	batch_id: number;
	ubication_id: number;
	amount: number;

	productEntity?: {
		product_id: number;
		reference: string;
		description: string;
	};
	ubicationEntity?: {
		ubication_id: number;
		hallway: string;
		position: number;
		height: number;
		depth: number;
	};
	batchEntity?: {
		batch_id: number;
		batch: string;
		expiry_date: string;
	};
}

class ProductUbicationService {
	async getProductUbicationByUbicationId(ubicationId: number): Promise<ProductUbication[]> {
		const response = await axios.post<ProductUbication[]>(
			`${API_URL}/product-ubication/getProductUbicationByUbicationId`,
			{ ubication_id: ubicationId },
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async getProductUbicationsByProductId(productId: number): Promise<ProductUbication[]> {
		const response = await axios.post<ProductUbication[]>(
			`${API_URL}/product-ubication/getProductUbicationsByProductId`,
			{ product_id: productId },
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async getProductUbicationsByBatchId(batchId: number): Promise<ProductUbication[]> {
		const response = await axios.post<ProductUbication[]>(
			`${API_URL}/product-ubication/getProductUbicationsByBatchId`,
			{ batch_id: batchId },
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}
	async receiveNewProduct(data: { ubication_id: number; product_id: number; batch_id: number; amount: number }): Promise<ProductUbication> {
		const response = await axios.post<ProductUbication>(
			`${API_URL}/product-ubication/receiveNewProduct`,
			data,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}
	async dispatchProduct(data: { ubication_id: number; product_id: number; batch_id: number; amount: number }): Promise<void> {
		await axios.post(
			`${API_URL}/product-ubication/dispatchProduct`,
			data,
			{ headers: authService.getAuthHeader() }
		);
	}

	async emptyUbication(ubicationId: number): Promise<void> {
		await axios.post(
			`${API_URL}/product-ubication/emptyUbication`,
			{ ubication_id: ubicationId },
			{ headers: authService.getAuthHeader() }
		);
	}

	async moveProductFromUbicationToUbication(data: { from_ubication_id: number; to_ubication_id: number; product_id: number; batch_id: number; amount: number }): Promise<ProductUbication> {
		const response = await axios.post<ProductUbication>(
			`${API_URL}/product-ubication/moveProductFromUbicationToUbication`,
			data,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async moveAllProductsFromUbicationToUbication(data: { from_ubication_id: number; to_ubication_id: number }): Promise<void> {
		await axios.post(
			`${API_URL}/product-ubication/moveAllProductsFromUbicationToUbication`,
			data,
			{ headers: authService.getAuthHeader() }
		);
	}
}

export const productUbicationService = new ProductUbicationService();
export default productUbicationService;

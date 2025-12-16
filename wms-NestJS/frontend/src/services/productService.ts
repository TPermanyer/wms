import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_WMS_SERVER_URL || 'http://localhost:3006';

export interface Product {
	product_id: number;
	reference: string;
	description: string;
	obsolete: boolean;
	company: number;
}

class ProductService {
	async getAllProducts(): Promise<Product[]> {
		const response = await axios.post<Product[]>(
			`${API_URL}/product/getAllProducts`,
			{},
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async createProduct(product: Omit<Product, 'product_id'>): Promise<Product> {
		const response = await axios.post<Product>(
			`${API_URL}/product/createProduct`,
			product,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}

	async deleteProduct(productId: number): Promise<void> {
		await axios.post(
			`${API_URL}/product/deleteProductById`,
			{ product_id: productId },
			{ headers: authService.getAuthHeader() }
		);
	}

	async updateProduct(product: Partial<Product> & { product_id: number }): Promise<Product> {
		const response = await axios.post<Product>(
			`${API_URL}/product/modifyProductById`,
			product,
			{ headers: authService.getAuthHeader() }
		);
		return response.data;
	}
}

export const productService = new ProductService();
export default productService;

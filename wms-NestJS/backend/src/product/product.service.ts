import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Product } from './product.entity';
import { ProductUbication } from '../product_ubication/product_ubication.entity';
import { Batch } from '../batch/batch.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductByIdDto } from './dto/get-product-by-id.dto';
import { ModifyProductByIdDto } from './dto/modify-product-by-id.dto';
import { DeleteProductByIdDto } from './dto/delete-product-by-id.dto';

@Injectable()
export class ProductService {

	async createProduct(em: EntityManager, createProductDto: CreateProductDto): Promise<Product> {
		const product = em.create(Product, {
			reference: createProductDto.reference,
			description: createProductDto.description,
			obsolete: createProductDto.obsolete,
			company: createProductDto.company,
		});
		return em.save(product);
	}

	async getAllProducts(em: EntityManager): Promise<Product[]> {
		const products = await em.find(Product);
		return products;
	}

	async getProductById(em: EntityManager, getProductByIdDto: GetProductByIdDto): Promise<Product> {
		const product = await em.findOne(Product, { where: { product_id: getProductByIdDto.product_id } });
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	async modifyProductById(em: EntityManager, modifyProductByIdDto: ModifyProductByIdDto): Promise<Product> {
		const product = await this.getProductById(em, { product_id: modifyProductByIdDto.product_id });
		if (modifyProductByIdDto.reference !== undefined) product.reference = modifyProductByIdDto.reference;
		if (modifyProductByIdDto.description !== undefined) product.description = modifyProductByIdDto.description;
		if (modifyProductByIdDto.obsolete !== undefined) product.obsolete = modifyProductByIdDto.obsolete;
		if (modifyProductByIdDto.company !== undefined) product.company = modifyProductByIdDto.company;
		return em.save(product);
	}

	async deleteProductById(em: EntityManager, deleteProductByIdDto: DeleteProductByIdDto): Promise<void> {
		const product = await this.getProductById(em, deleteProductByIdDto);

		const productUbicationCount = await em.count(ProductUbication, { where: { product_id: product.product_id } });
		if (productUbicationCount > 0) {
			throw new ConflictException('No se puede eliminar el producto porque tiene ubicaciones asociadas.');
		}

		const batchCount = await em.count(Batch, { where: { product_id: product.product_id } });
		if (batchCount > 0) {
			throw new ConflictException('No se puede eliminar el producto porque tiene lotes asociados.');
		}

		await em.remove(product);
	}
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductByIdDto } from './dto/get-product-by-id.dto';
import { ModifyProductByIdDto } from './dto/modify-product-by-id.dto';
import { DeleteProductByIdDto } from './dto/delete-product-by-id.dto';

@ApiBearerAuth()

@ApiTags('Product')
@Controller('product')
export class ProductController {
	constructor(
		private readonly service: ProductService,
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	@Post('createProduct')
	@ApiOperation({ summary: 'Create a new product' })
	async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
		return await this.em.transaction((manager) =>
			this.service.createProduct(manager, createProductDto),
		);
	}

	@Post('getAllProducts')
	@ApiOperation({ summary: 'List all products' })
	async getAllProducts(): Promise<Product[]> {
		return await this.em.transaction((manager) =>
			this.service.getAllProducts(manager),
		);
	}

	@Post('getProductById')
	@ApiOperation({ summary: 'Get a product by id' })
	async getProductById(@Body() getProductByIdDto: GetProductByIdDto): Promise<Product> {
		return await this.em.transaction((manager) =>
			this.service.getProductById(manager, getProductByIdDto),
		);
	}

	@Post('modifyProductById')
	@ApiOperation({ summary: 'Modify a product by id' })
	async modifyProductById(@Body() modifyProductByIdDto: ModifyProductByIdDto): Promise<Product> {
		return await this.em.transaction((manager) =>
			this.service.modifyProductById(manager, modifyProductByIdDto),
		);
	}

	@Post('deleteProductById')
	@ApiOperation({ summary: 'Delete a product by id' })
	async deleteProductById(@Body() deleteProductByIdDto: DeleteProductByIdDto): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.deleteProductById(manager, deleteProductByIdDto),
		);
	}
}

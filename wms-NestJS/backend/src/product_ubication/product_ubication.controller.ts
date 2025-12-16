import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductUbicationService } from './product_ubication.service';
import { ProductUbication } from './product_ubication.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductUbicationDto } from './dto/create-product-ubication.dto';
import { GetProductUbicationByIdDto } from './dto/get-product-ubication-by-id.dto';
import { GetProductUbicationByUbicationIdDto } from './dto/get-product-ubication-by-ubication-id.dto';
import { GetProductUbicationsByProductIdDto } from './dto/get-product-ubications-by-product-id.dto';
import { GetProductUbicationsByBatchIdDto } from './dto/get-product-ubications-by-batch-id.dto';
import { ModifyProductUbicationByIdDto } from './dto/modify-product-ubication-by-id.dto';
import { DeleteProductUbicationByIdDto } from './dto/delete-product-ubication-by-id.dto';
import { MoveProductFromUbicationToUbicationDto } from './dto/move-product-from-ubication-to-ubication.dto';
import { ReceiveNewProductDto } from './dto/receive-new-product.dto';
import { DispatchProductDto } from './dto/dispatch-product.dto';
import { EmptyUbicationDto } from './dto/empty-ubication.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MoveAllProductsDto } from './dto/move-all-products.dto';

@ApiBearerAuth()

@ApiTags('ProductUbication')
@Controller('product-ubication')
export class ProductUbicationController {
	constructor(
		private readonly service: ProductUbicationService,
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	@Post('createProductUbication')
	@ApiOperation({ summary: 'Create a new product ubication' })
	async createProductUbication(@Body() createProductUbicationDto: CreateProductUbicationDto): Promise<ProductUbication> {
		return await this.em.transaction((manager) =>
			this.service.createProductUbication(manager, createProductUbicationDto),
		);
	}

	@Post('getAllProductUbications')
	@ApiOperation({ summary: 'List all product ubications' })
	async getAllProductUbications(): Promise<ProductUbication[]> {
		return await this.em.transaction((manager) =>
			this.service.getAllProductUbications(manager),
		);
	}

	@Post('getProductUbicationById')
	@ApiOperation({ summary: 'Get a product ubication by id' })
	async getProductUbicationById(@Body() getProductUbicationByIdDto: GetProductUbicationByIdDto): Promise<ProductUbication> {
		return await this.em.transaction((manager) =>
			this.service.getProductUbicationById(manager, getProductUbicationByIdDto),
		);
	}

	@Post('getProductUbicationByUbicationId')
	@ApiOperation({ summary: 'Get all products in an ubication' })
	async getProductUbicationByUbicationId(@Body() getProductUbicationByUbicationIdDto: GetProductUbicationByUbicationIdDto): Promise<ProductUbication[]> {
		return await this.em.transaction((manager) =>
			this.service.getProductUbicationByUbicationId(manager, getProductUbicationByUbicationIdDto),
		);
	}

	@Post('getProductUbicationsByProductId')
	@ApiOperation({ summary: 'Get all ubications for a product sorted by expiry' })
	async getProductUbicationsByProductId(@Body() getProductUbicationsByProductIdDto: GetProductUbicationsByProductIdDto): Promise<ProductUbication[]> {
		return await this.em.transaction((manager) =>
			this.service.getProductUbicationsByProductId(manager, getProductUbicationsByProductIdDto),
		);
	}

	@Post('getProductUbicationsByBatchId')
	@ApiOperation({ summary: 'Get all ubications for a batch' })
	async getProductUbicationsByBatchId(@Body() getProductUbicationsByBatchIdDto: GetProductUbicationsByBatchIdDto): Promise<ProductUbication[]> {
		return await this.em.transaction((manager) =>
			this.service.getProductUbicationsByBatchId(manager, getProductUbicationsByBatchIdDto),
		);
	}

	@Post('modifyProductUbicationById')
	@ApiOperation({ summary: 'Modify a product ubication by id' })
	async modifyProductUbicationById(@Body() modifyProductUbicationByIdDto: ModifyProductUbicationByIdDto): Promise<ProductUbication> {
		return await this.em.transaction((manager) =>
			this.service.modifyProductUbicationById(manager, modifyProductUbicationByIdDto),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post('moveProductFromUbicationToUbication')
	@ApiOperation({ summary: 'Move a product from ubication A to ubication B' })
	async moveProductFromUbicationToUbication(@Body() moveProductFromUbicationToUbicationDto: MoveProductFromUbicationToUbicationDto, @GetUser() user: any): Promise<ProductUbication> {
		return await this.em.transaction((manager) =>
			this.service.moveProductFromUbicationToUbication(manager, moveProductFromUbicationToUbicationDto, user),
		);
	}
	@UseGuards(JwtAuthGuard)
	@Post('moveAllProductsFromUbicationToUbication')
	@ApiOperation({ summary: 'Move all products from ubication A to ubication B' })
	async moveAllProductsFromUbicationToUbication(@Body() moveAllProductsDto: MoveAllProductsDto, @GetUser() user: any): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.moveAllProducts(manager, moveAllProductsDto, user),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post('receiveNewProduct')
	@ApiOperation({ summary: 'Receive new product into an ubication (creates or updates product_ubication)' })
	async receiveNewProduct(@Body() receiveNewProductDto: ReceiveNewProductDto, @GetUser() user: any): Promise<ProductUbication> {
		return await this.em.transaction((manager) =>
			this.service.receiveNewProduct(manager, receiveNewProductDto, user),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post('dispatchProduct')
	@ApiOperation({ summary: 'Dispatch product from an ubication (removes or reduces stock, product leaves warehouse)' })
	async dispatchProduct(@Body() dispatchProductDto: DispatchProductDto, @GetUser() user: any): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.dispatchProduct(manager, dispatchProductDto, user),
		);
	}

	@Post('deleteProductUbicationById')
	@ApiOperation({ summary: 'Delete a product ubication by id' })
	async deleteProductUbicationById(@Body() deleteProductUbicationByIdDto: DeleteProductUbicationByIdDto): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.deleteProductUbicationById(manager, deleteProductUbicationByIdDto),
		);
	}
	@UseGuards(JwtAuthGuard)
	@Post('emptyUbication')
	@ApiOperation({ summary: 'Empty an ubication (remove all products and log movements)' })
	async emptyUbication(@Body() emptyUbicationDto: EmptyUbicationDto, @GetUser() user: any): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.emptyUbication(manager, emptyUbicationDto, user),
		);
	}
}

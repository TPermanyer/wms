import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ProductUbication } from './product_ubication.entity';
import { CreateProductUbicationDto } from './dto/create-product-ubication.dto';
import { GetProductUbicationByIdDto } from './dto/get-product-ubication-by-id.dto';
import { ModifyProductUbicationByIdDto } from './dto/modify-product-ubication-by-id.dto';
import { DeleteProductUbicationByIdDto } from './dto/delete-product-ubication-by-id.dto';
import { MoveProductFromUbicationToUbicationDto } from './dto/move-product-from-ubication-to-ubication.dto';
import { GetProductUbicationByUbicationIdDto } from './dto/get-product-ubication-by-ubication-id.dto';
import { GetProductUbicationsByProductIdDto } from './dto/get-product-ubications-by-product-id.dto';
import { GetProductUbicationsByBatchIdDto } from './dto/get-product-ubications-by-batch-id.dto';
import { ReceiveNewProductDto } from './dto/receive-new-product.dto';
import { DispatchProductDto } from './dto/dispatch-product.dto';
import { EmptyUbicationDto } from './dto/empty-ubication.dto';
import { MovementLogService } from '../movement_log/movement_log.service';
import { MoveAllProductsDto } from './dto/move-all-products.dto';

@Injectable()
export class ProductUbicationService {
	constructor(
		@Inject(forwardRef(() => MovementLogService))
		private readonly movementLogService: MovementLogService

	) { }

	async createProductUbication(em: EntityManager, createProductUbicationDto: CreateProductUbicationDto): Promise<ProductUbication> {
		const productUbication = em.create(ProductUbication, {
			product_id: createProductUbicationDto.product_id,
			batch_id: createProductUbicationDto.batch_id,
			amount: createProductUbicationDto.amount,
		});
		return em.save(productUbication);
	}

	async getAllProductUbications(em: EntityManager): Promise<ProductUbication[]> {
		const productUbications = await em.find(ProductUbication);
		return productUbications;
	}

	async getProductUbicationById(em: EntityManager, getProductUbicationByIdDto: GetProductUbicationByIdDto): Promise<ProductUbication> {
		const productUbication = await em.findOne(ProductUbication, { where: { product_ubication_id: getProductUbicationByIdDto.product_ubication_id } });
		if (!productUbication) throw new NotFoundException('ProductUbication not found');
		return productUbication;
	}

	async getProductUbicationByUbicationId(em: EntityManager, getProductUbicationByUbicationIdDto: GetProductUbicationByUbicationIdDto): Promise<ProductUbication[]> {
		const productUbication = await em.find(ProductUbication, {
			where: { ubication_id: getProductUbicationByUbicationIdDto.ubication_id },
			relations: ['productEntity', 'batchEntity']
		});
		return productUbication;
	}

	async getProductUbicationsByProductId(em: EntityManager, getProductUbicationsByProductIdDto: GetProductUbicationsByProductIdDto): Promise<ProductUbication[]> {
		const productUbications = await em.find(ProductUbication, {
			where: { product_id: getProductUbicationsByProductIdDto.product_id },
			relations: ['ubicationEntity', 'batchEntity']
		});

		// Sort by expiry date ASC (First Expired First Out)
		return productUbications.sort((a, b) => {
			const dateA = a.batchEntity?.expiry_date ? new Date(a.batchEntity.expiry_date).getTime() : 0;
			const dateB = b.batchEntity?.expiry_date ? new Date(b.batchEntity.expiry_date).getTime() : 0;

			// Handle null/undefined dates (e.g. put undefined at end or beginning, assuming valid dates come first for FEFO)
			if (dateA === 0 && dateB !== 0) return 1;
			if (dateA !== 0 && dateB === 0) return -1;
			return dateA - dateB;
		});
	}

	async getProductUbicationsByBatchId(em: EntityManager, getProductUbicationsByBatchIdDto: GetProductUbicationsByBatchIdDto): Promise<ProductUbication[]> {
		const productUbications = await em.find(ProductUbication, {
			where: { batch_id: getProductUbicationsByBatchIdDto.batch_id },
			relations: ['ubicationEntity', 'productEntity']
		});
		return productUbications;
	}

	async modifyProductUbicationById(em: EntityManager, modifyProductUbicationByIdDto: ModifyProductUbicationByIdDto): Promise<ProductUbication> {
		const productUbication = await this.getProductUbicationById(em, { product_ubication_id: modifyProductUbicationByIdDto.product_ubication_id });
		if (modifyProductUbicationByIdDto.product_id !== undefined) productUbication.product_id = modifyProductUbicationByIdDto.product_id;
		if (modifyProductUbicationByIdDto.batch_id !== undefined) productUbication.batch_id = modifyProductUbicationByIdDto.batch_id;
		if (modifyProductUbicationByIdDto.ubication_id !== undefined) productUbication.ubication_id = modifyProductUbicationByIdDto.ubication_id;
		if (modifyProductUbicationByIdDto.amount !== undefined) productUbication.amount = modifyProductUbicationByIdDto.amount;
		return em.save(productUbication);
	}



	async moveProductFromUbicationToUbication(em: EntityManager, moveProductFromUbicationToUbicationDto: MoveProductFromUbicationToUbicationDto, user: any): Promise<ProductUbication> {
		const fromProductUbication = await em.findOne(ProductUbication, {
			where: {
				ubication_id: moveProductFromUbicationToUbicationDto.from_ubication_id,
				product_id: moveProductFromUbicationToUbicationDto.product_id,
				batch_id: moveProductFromUbicationToUbicationDto.batch_id,
			},
		});
		if (!fromProductUbication) {
			throw new NotFoundException(
				`No stock found at ubication ${moveProductFromUbicationToUbicationDto.from_ubication_id} for product ${moveProductFromUbicationToUbicationDto.product_id} with batch ${moveProductFromUbicationToUbicationDto.batch_id}`
			);
		}

		if (fromProductUbication.amount < moveProductFromUbicationToUbicationDto.amount) {
			throw new BadRequestException(
				`Insufficient stock. Available: ${fromProductUbication.amount}, Requested: ${moveProductFromUbicationToUbicationDto.amount}`
			);
		}

		fromProductUbication.amount -= moveProductFromUbicationToUbicationDto.amount;
		if (fromProductUbication.amount === 0) {
			await em.remove(fromProductUbication);
		} else {
			await em.save(fromProductUbication);
		}

		let toProductUbication = await em.findOne(ProductUbication, {
			where: {
				ubication_id: moveProductFromUbicationToUbicationDto.to_ubication_id,
				product_id: moveProductFromUbicationToUbicationDto.product_id,
				batch_id: moveProductFromUbicationToUbicationDto.batch_id,
			},
		});

		if (toProductUbication) {
			toProductUbication.amount += moveProductFromUbicationToUbicationDto.amount;
		} else {
			toProductUbication = em.create(ProductUbication, {
				ubication_id: moveProductFromUbicationToUbicationDto.to_ubication_id,
				product_id: moveProductFromUbicationToUbicationDto.product_id,
				batch_id: moveProductFromUbicationToUbicationDto.batch_id,
				amount: moveProductFromUbicationToUbicationDto.amount,
			});
		}

		await this.movementLogService.createMovementLog(em, {
			user_id: user.id,
			from_ubication_id: moveProductFromUbicationToUbicationDto.from_ubication_id,
			to_ubication_id: moveProductFromUbicationToUbicationDto.to_ubication_id,
			product_id: moveProductFromUbicationToUbicationDto.product_id,
			batch_id: moveProductFromUbicationToUbicationDto.batch_id,
			amount: moveProductFromUbicationToUbicationDto.amount,
			timestamp: new Date(),
		});

		return em.save(toProductUbication);
	}

	async receiveNewProduct(em: EntityManager, receiveNewProductDto: ReceiveNewProductDto, user: any): Promise<ProductUbication> {
		let productUbication = await em.findOne(ProductUbication, {
			where: {
				ubication_id: receiveNewProductDto.ubication_id,
				product_id: receiveNewProductDto.product_id,
				batch_id: receiveNewProductDto.batch_id,
			},
		});
		if (productUbication) {
			productUbication.amount += receiveNewProductDto.amount;
		} else {
			productUbication = em.create(ProductUbication, {
				ubication_id: receiveNewProductDto.ubication_id,
				product_id: receiveNewProductDto.product_id,
				batch_id: receiveNewProductDto.batch_id,
				amount: receiveNewProductDto.amount,
			});
		}
		await this.movementLogService.createMovementLog(em, {
			user_id: user.id,
			from_ubication_id: undefined,
			to_ubication_id: receiveNewProductDto.ubication_id,
			product_id: receiveNewProductDto.product_id,
			batch_id: receiveNewProductDto.batch_id,
			amount: receiveNewProductDto.amount,
			timestamp: new Date(),
		});

		return em.save(productUbication);
	}

	async dispatchProduct(em: EntityManager, dispatchProductDto: DispatchProductDto, user: any): Promise<void> {
		const productUbication = await em.findOne(ProductUbication, {
			where: {
				ubication_id: dispatchProductDto.ubication_id,
				product_id: dispatchProductDto.product_id,
				batch_id: dispatchProductDto.batch_id,
			},
		});

		if (!productUbication) {
			throw new NotFoundException(
				`No stock found at ubication ${dispatchProductDto.ubication_id} for product ${dispatchProductDto.product_id} with batch ${dispatchProductDto.batch_id}`
			);
		}

		if (productUbication.amount < dispatchProductDto.amount) {
			throw new BadRequestException(
				`Insufficient stock. Available: ${productUbication.amount}, Requested: ${dispatchProductDto.amount}`
			);
		}

		productUbication.amount -= dispatchProductDto.amount;
		if (productUbication.amount === 0) {
			await em.remove(productUbication);
		} else {
			await em.save(productUbication);
		}

		await this.movementLogService.createMovementLog(em, {
			user_id: user.id,
			from_ubication_id: dispatchProductDto.ubication_id,
			to_ubication_id: undefined,
			product_id: dispatchProductDto.product_id,
			batch_id: dispatchProductDto.batch_id,
			amount: dispatchProductDto.amount,
			timestamp: new Date(),
		});
	}

	async deleteProductUbicationById(em: EntityManager, deleteProductUbicationByIdDto: DeleteProductUbicationByIdDto): Promise<void> {
		const productUbication = await this.getProductUbicationById(em, deleteProductUbicationByIdDto);
		await em.remove(productUbication);
	}
	async emptyUbication(em: EntityManager, emptyUbicationDto: EmptyUbicationDto, user: any): Promise<void> {
		if (!emptyUbicationDto.ubication_id) {
			throw new BadRequestException('Ubication ID is required');
		}

		// Double check it's not empty object somehow passed through
		if (Object.keys(emptyUbicationDto).length === 0) {
			throw new BadRequestException('Invalid request body');
		}

		// Explicit check to ensure we are not deleting everything
		if (typeof emptyUbicationDto.ubication_id !== 'number') {
			throw new BadRequestException('Invalid Ubication ID type');
		}

		const productUbications = await em.find(ProductUbication, {
			where: { ubication_id: emptyUbicationDto.ubication_id },
		});

		for (const pu of productUbications) {
			await this.movementLogService.createMovementLog(em, {
				user_id: user.id,
				from_ubication_id: pu.ubication_id,
				to_ubication_id: undefined,
				product_id: pu.product_id,
				batch_id: pu.batch_id,
				amount: pu.amount,
				timestamp: new Date(),
			});
			await em.remove(pu);
		}
	}

	async moveAllProducts(em: EntityManager, moveAllProductsDto: MoveAllProductsDto, user: any): Promise<void> {
		if (moveAllProductsDto.from_ubication_id === moveAllProductsDto.to_ubication_id) {
			throw new BadRequestException('Source and destination ubications must be different');
		}

		const productUbications = await em.find(ProductUbication, {
			where: { ubication_id: moveAllProductsDto.from_ubication_id },
		});

		for (const pu of productUbications) {
			await this.moveProductFromUbicationToUbication(em, {
				from_ubication_id: moveAllProductsDto.from_ubication_id,
				to_ubication_id: moveAllProductsDto.to_ubication_id,
				product_id: pu.product_id,
				batch_id: pu.batch_id,
				amount: pu.amount,
			}, user);
		}
	}
}

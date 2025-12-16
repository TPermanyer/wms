import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Ubication } from '../ubication/ubication.entity';
import { ProductUbication } from '../product_ubication/product_ubication.entity';
import { Product } from '../product/product.entity';
import { Batch } from '../batch/batch.entity';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	async getDashboardStats() {
		const totalUbications = await this.em.count(Ubication);

		// Count distinct ubication_ids in ProductUbication to find occupied ones
		const occupiedUbicationsResult = await this.em
			.createQueryBuilder(ProductUbication, 'pu')
			.select('COUNT(DISTINCT pu.ubication_id)', 'count')
			.getRawOne();

		const occupiedUbications = parseInt(occupiedUbicationsResult.count, 10) || 0;
		const occupancyPercentage = totalUbications > 0 ? (occupiedUbications / totalUbications) * 100 : 0;

		const totalProducts = await this.em.count(Product);
		const totalBatches = await this.em.count(Batch);

		// Calculate total distinct items in stock (optional, total rows in product_ubication isn't same as total items, assume sum of amount)
		const totalStockResult = await this.em
			.createQueryBuilder(ProductUbication, 'pu')
			.select('SUM(pu.amount)', 'sum')
			.getRawOne();
		const totalStockItems = parseInt(totalStockResult.sum, 10) || 0;

		return {
			totalUbications,
			occupiedUbications,
			occupancyPercentage: parseFloat(occupancyPercentage.toFixed(2)),
			totalProducts,
			totalBatches,
			totalStockItems
		};
	}

	async getExpiringProducts() {
		const sixMonthsFromNow = new Date();
		sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

		const qb = this.em.createQueryBuilder(ProductUbication, 'pu')
			.innerJoinAndSelect('pu.batchEntity', 'batch')
			.innerJoinAndSelect('pu.productEntity', 'product')
			.innerJoinAndSelect('pu.ubicationEntity', 'ubication')
			.where('batch.expiry_date <= :date', { date: sixMonthsFromNow })
			.orderBy('batch.expiry_date', 'ASC');

		return await qb.getMany();
	}
}

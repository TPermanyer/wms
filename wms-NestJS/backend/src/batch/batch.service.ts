import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Batch } from './batch.entity';
import { Product } from '../product/product.entity';
import { ProductUbication } from '../product_ubication/product_ubication.entity';
import { CreateBatchDto } from './dto/create-batch.dto';
import { GetAllBatchesByProductIdDto } from './dto/get-all-batches-by-product-id.dto';
import { GetBatchByIdDto } from './dto/get-batch-by-id.dto';
import { DeleteBatchByIdDto } from './dto/delete-batch-by-id.dto';
import { ModifyBatchByIdDto } from './dto/modify-batch-by-id.dto';

@Injectable()
export class BatchService {

	async createBatch(em: EntityManager, createBatchDto: CreateBatchDto): Promise<Batch> {
		const batch = em.create(Batch, { product_id: createBatchDto.product_id, batch: createBatchDto.batch, expiry_date: createBatchDto.expiry_date });
		return em.save(batch);
	}

	async getAllBatchesByProductId(em: EntityManager, getAllBatchesByProductIdDto: GetAllBatchesByProductIdDto): Promise<Batch[]> {
		const batches = em.find(Batch, { where: { product_id: getAllBatchesByProductIdDto.product_id } as any });
		return batches;
	}

	async getBatchById(em: EntityManager, getBatchByIdDto: GetBatchByIdDto): Promise<Batch> {
		const batch = await em.findOne(Batch, { where: { batch_id: getBatchByIdDto.batch_id } });
		if (!batch) throw new NotFoundException('Batch not found');
		return batch;
	}

	async getAllBatches(em: EntityManager): Promise<Batch[]> {
		const batches = em.find(Batch);
		return batches;
	}

	async deleteBatchById(em: EntityManager, deleteBatchByIdDto: DeleteBatchByIdDto): Promise<void> {
		const batch = await this.getBatchById(em, deleteBatchByIdDto);

		const productUbicationCount = await em.count(ProductUbication, { where: { batch_id: batch.batch_id } });
		if (productUbicationCount > 0) {
			throw new ConflictException('No se puede eliminar el lote porque está siendo usado en stock.');
		}

		await em.remove(batch);
	}

	async modifyBatchById(em: EntityManager, modifyBatchByIdDto: ModifyBatchByIdDto): Promise<Batch> {
		const batch = await this.getBatchById(em, { batch_id: modifyBatchByIdDto.batch_id });
		if (modifyBatchByIdDto.batch !== undefined) batch.batch = modifyBatchByIdDto.batch;
		if (modifyBatchByIdDto.product_id !== undefined) batch.product_id = modifyBatchByIdDto.product_id;
		if (modifyBatchByIdDto.expiry_date !== undefined) batch.expiry_date = modifyBatchByIdDto.expiry_date;
		return em.save(batch);
	}
}

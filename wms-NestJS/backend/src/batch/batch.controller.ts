import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BatchService } from './batch.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Batch } from './batch.entity';
import { CreateBatchDto } from './dto/create-batch.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetAllBatchesByProductIdDto } from './dto/get-all-batches-by-product-id.dto';
import { GetBatchByIdDto } from './dto/get-batch-by-id.dto';
import { DeleteBatchByIdDto } from './dto/delete-batch-by-id.dto';
import { ModifyBatchByIdDto } from './dto/modify-batch-by-id.dto';

@ApiBearerAuth()

@ApiTags('Batch')
@Controller('batch')
export class BatchController {
	constructor(
		private readonly service: BatchService,
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	@Post('createBatch')
	@ApiOperation({ summary: 'Create a new batch for a product' })
	async createBatch(@Body() createBatchDto: CreateBatchDto): Promise<Batch> {
		return await this.em.transaction((manager) =>
			this.service.createBatch(manager, createBatchDto),
		);
	}

	@Post('getAllBatches')
	@ApiOperation({ summary: 'List all batches' })
	async getAllBatches(): Promise<Batch[]> {
		return await this.em.transaction((manager) =>
			this.service.getAllBatches(manager),
		);
	}

	@Post('getAllBatchesByProductId')
	@ApiOperation({ summary: 'List all batches by product id' })
	async getAllBatchesByProductId(@Body() getAllBatchesByProductIdDto: GetAllBatchesByProductIdDto, @GetUser() user: any): Promise<Batch[]> {
		return await this.em.transaction((manager) =>
			this.service.getAllBatchesByProductId(manager, getAllBatchesByProductIdDto),
		);
	}

	@Post('getBatchById')
	@ApiOperation({ summary: 'Get a batch by id' })
	async getBatchById(@Body() getBatchByIdDto: GetBatchByIdDto): Promise<Batch> {
		return await this.em.transaction((manager) =>
			this.service.getBatchById(manager, getBatchByIdDto),
		);
	}


	@Post('deleteBatchById')
	@ApiOperation({ summary: 'Delete a batch by id' })
	async deleteBatchById(@Body() deleteBatchByIdDto: DeleteBatchByIdDto): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.deleteBatchById(manager, deleteBatchByIdDto),
		);
	}

	@Post('modifyBatchById')
	@ApiOperation({ summary: 'Modify a batch by id' })
	async modifyBatchById(@Body() modifyBatchByIdDto: ModifyBatchByIdDto): Promise<Batch> {
		return await this.em.transaction((manager) =>
			this.service.modifyBatchById(manager, modifyBatchByIdDto),
		);
	}
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovementLogService } from './movement_log.service';
import { MovementLog } from './movement_log.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';
import { GetMovementLogByIdDto } from './dto/get-movement-log-by-id.dto';
import { GetMovementLogsByUserIdDto } from './dto/get-movement-logs-by-user-id.dto';
import { DeleteMovementLogByIdDto } from './dto/delete-movement-log-by-id.dto';

@ApiBearerAuth()

@ApiTags('MovementLog')
@Controller('movement-log')
export class MovementLogController {
	constructor(
		private readonly service: MovementLogService,
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	@Post('createMovementLog')
	@ApiOperation({ summary: 'Log a new movement' })
	async createMovementLog(@Body() createMovementLogDto: CreateMovementLogDto): Promise<MovementLog> {
		return await this.em.transaction((manager) =>
			this.service.createMovementLog(manager, createMovementLogDto),
		);
	}

	@Post('getAllMovementLogs')
	@ApiOperation({ summary: 'List all movement logs' })
	async getAllMovementLogs(): Promise<MovementLog[]> {
		return await this.em.transaction((manager) =>
			this.service.getAllMovementLogs(manager),
		);
	}

	@Post('getMovementLogById')
	@ApiOperation({ summary: 'Get a movement log by id' })
	async getMovementLogById(@Body() getMovementLogByIdDto: GetMovementLogByIdDto): Promise<MovementLog> {
		return await this.em.transaction((manager) =>
			this.service.getMovementLogById(manager, getMovementLogByIdDto),
		);
	}

	@Post('getMovementLogsByUserId')
	@ApiOperation({ summary: 'Get all movement logs by user id' })
	async getMovementLogsByUserId(@Body() getMovementLogsByUserIdDto: GetMovementLogsByUserIdDto): Promise<MovementLog[]> {
		return await this.em.transaction((manager) =>
			this.service.getMovementLogsByUserId(manager, getMovementLogsByUserIdDto),
		);
	}

	@Post('deleteMovementLogById')
	@ApiOperation({ summary: 'Delete a movement log by id' })
	async deleteMovementLogById(@Body() deleteMovementLogByIdDto: DeleteMovementLogByIdDto): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.deleteMovementLogById(manager, deleteMovementLogByIdDto),
		);
	}
}

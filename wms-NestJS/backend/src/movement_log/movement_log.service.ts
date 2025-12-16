import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MovementLog } from './movement_log.entity';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';
import { GetMovementLogByIdDto } from './dto/get-movement-log-by-id.dto';
import { GetMovementLogsByUserIdDto } from './dto/get-movement-logs-by-user-id.dto';
import { DeleteMovementLogByIdDto } from './dto/delete-movement-log-by-id.dto';

@Injectable()
export class MovementLogService {

	async createMovementLog(em: EntityManager, createMovementLogDto: CreateMovementLogDto): Promise<MovementLog> {
		const movementLog = em.create(MovementLog, {
			user_id: createMovementLogDto.user_id,
			from_ubication_id: createMovementLogDto.from_ubication_id,
			to_ubication_id: createMovementLogDto.to_ubication_id,
			product_id: createMovementLogDto.product_id,
			batch_id: createMovementLogDto.batch_id,
			amount: createMovementLogDto.amount,
			timestamp: createMovementLogDto.timestamp,
		});
		return em.save(movementLog);
	}

	async getAllMovementLogs(em: EntityManager): Promise<MovementLog[]> {
		const movementLogs = await em.find(MovementLog, {
			relations: ['userEntity', 'productEntity', 'fromUbicationEntity', 'toUbicationEntity'],
			order: { timestamp: 'DESC' }
		});
		return movementLogs;
	}

	async getMovementLogById(em: EntityManager, getMovementLogByIdDto: GetMovementLogByIdDto): Promise<MovementLog> {
		const movementLog = await em.findOne(MovementLog, { where: { movement_log_id: getMovementLogByIdDto.movement_log_id } });
		if (!movementLog) throw new NotFoundException('MovementLog not found');
		return movementLog;
	}

	async getMovementLogsByUserId(em: EntityManager, getMovementLogsByUserIdDto: GetMovementLogsByUserIdDto): Promise<MovementLog[]> {
		const movementLogs = await em.find(MovementLog, { where: { user_id: getMovementLogsByUserIdDto.user_id } });
		return movementLogs;
	}

	async deleteMovementLogById(em: EntityManager, deleteMovementLogByIdDto: DeleteMovementLogByIdDto): Promise<void> {
		const movementLog = await this.getMovementLogById(em, deleteMovementLogByIdDto);
		await em.remove(movementLog);
	}
}

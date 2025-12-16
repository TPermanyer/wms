import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UbicationService } from './ubication.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Ubication } from './ubication.entity';
import { CreateUbicationDto } from './dto/create-ubication.dto';
import { GetUbicationByIdDto } from './dto/get-ubication-by-id.dto';
import { ModifyUbicationByIdDto } from './dto/modify-ubication-by-id.dto';
import { DeleteUbicationByIdDto } from './dto/delete-ubication-by-id.dto';

@ApiBearerAuth()

@ApiTags('Ubication')
@Controller('ubication')
export class UbicationController {
	constructor(
		private readonly service: UbicationService,
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	@Post('createUbication')
	@ApiOperation({ summary: 'Create a new ubication' })
	async createUbication(@Body() createUbicationDto: CreateUbicationDto): Promise<Ubication> {
		return await this.em.transaction((manager) =>
			this.service.createUbication(manager, createUbicationDto),
		);
	}

	@Post('getAllUbications')
	@ApiOperation({ summary: 'List all ubications' })
	async getAllUbications(): Promise<Ubication[]> {
		return await this.em.transaction((manager) =>
			this.service.getAllUbications(manager),
		);
	}

	@Post('getUbicationById')
	@ApiOperation({ summary: 'Get an ubication by id' })
	async getUbicationById(@Body() getUbicationByIdDto: GetUbicationByIdDto): Promise<Ubication> {
		return await this.em.transaction((manager) =>
			this.service.getUbicationById(manager, getUbicationByIdDto),
		);
	}

	@Post('modifyUbicationById')
	@ApiOperation({ summary: 'Modify an ubication by id' })
	async modifyUbicationById(@Body() modifyUbicationByIdDto: ModifyUbicationByIdDto): Promise<Ubication> {
		return await this.em.transaction((manager) =>
			this.service.modifyUbicationById(manager, modifyUbicationByIdDto),
		);
	}

	@Post('deleteUbicationById')
	@ApiOperation({ summary: 'Delete an ubication by id' })
	async deleteUbicationById(@Body() deleteUbicationByIdDto: DeleteUbicationByIdDto): Promise<void> {
		return await this.em.transaction((manager) =>
			this.service.deleteUbicationById(manager, deleteUbicationByIdDto),
		);
	}
}

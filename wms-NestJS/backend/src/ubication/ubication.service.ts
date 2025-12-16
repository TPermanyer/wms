import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Ubication } from './ubication.entity';
import { ProductUbication } from '../product_ubication/product_ubication.entity';
import { CreateUbicationDto } from './dto/create-ubication.dto';
import { GetUbicationByIdDto } from './dto/get-ubication-by-id.dto';
import { ModifyUbicationByIdDto } from './dto/modify-ubication-by-id.dto';
import { DeleteUbicationByIdDto } from './dto/delete-ubication-by-id.dto';

@Injectable()
export class UbicationService {

	async createUbication(em: EntityManager, createUbicationDto: CreateUbicationDto): Promise<Ubication> {
		const ubication = em.create(Ubication, {
			hallway: createUbicationDto.hallway,
			position: createUbicationDto.position,
			height: createUbicationDto.height,
			depth: createUbicationDto.depth,
		});
		return em.save(ubication);
	}

	async getAllUbications(em: EntityManager): Promise<Ubication[]> {
		const ubications = await em.find(Ubication, { relations: ['productUbicationList'] });
		return ubications;
	}

	async getUbicationById(em: EntityManager, getUbicationByIdDto: GetUbicationByIdDto): Promise<Ubication> {
		const ubication = await em.findOne(Ubication, { where: { ubication_id: getUbicationByIdDto.ubication_id } });
		if (!ubication) throw new NotFoundException('Ubication not found');
		return ubication;
	}

	async modifyUbicationById(em: EntityManager, modifyUbicationByIdDto: ModifyUbicationByIdDto): Promise<Ubication> {
		const ubication = await this.getUbicationById(em, { ubication_id: modifyUbicationByIdDto.ubication_id });
		if (modifyUbicationByIdDto.hallway !== undefined) ubication.hallway = modifyUbicationByIdDto.hallway;
		if (modifyUbicationByIdDto.position !== undefined) ubication.position = modifyUbicationByIdDto.position;
		if (modifyUbicationByIdDto.height !== undefined) ubication.height = modifyUbicationByIdDto.height;
		if (modifyUbicationByIdDto.depth !== undefined) ubication.depth = modifyUbicationByIdDto.depth;
		return em.save(ubication);
	}

	async deleteUbicationById(em: EntityManager, deleteUbicationByIdDto: DeleteUbicationByIdDto): Promise<void> {
		const ubication = await this.getUbicationById(em, deleteUbicationByIdDto);

		const productUbicationCount = await em.count(ProductUbication, { where: { ubication_id: ubication.ubication_id } });
		if (productUbicationCount > 0) {
			throw new ConflictException('No se puede eliminar la ubicación porque contiene productos.');
		}

		await em.remove(ubication);
	}
}

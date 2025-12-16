import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetProductUbicationByUbicationIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	ubication_id!: number;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ModifyProductUbicationByIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_ubication_id!: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_id?: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	batch_id?: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	ubication_id?: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 100 })
	amount?: number;

	@IsOptional()
	@IsDateString()
	@ApiProperty({ default: '2024-01-01T00:00:00Z' })
	timestamp?: Date;
}


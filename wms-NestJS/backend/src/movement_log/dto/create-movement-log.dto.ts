import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMovementLogDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	user_id!: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	from_ubication_id?: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 2 })
	to_ubication_id?: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	batch_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 100 })
	amount!: number;

	@IsNotEmpty()
	@IsDateString()
	@ApiProperty({ default: '2024-01-01T00:00:00Z' })
	timestamp!: Date;
}

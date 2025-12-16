import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBatchDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_id!: number;

	@IsNotEmpty()
	@IsDateString()
	@ApiProperty({ default: '2026-12-31' })
	expiry_date!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ default: 'LOT-0001' })
	batch!: string;
}

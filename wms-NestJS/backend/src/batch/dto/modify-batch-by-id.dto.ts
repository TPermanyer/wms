import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class ModifyBatchByIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	batch_id!: number;

	@IsInt()
	@IsOptional()
	@ApiProperty({ default: 1 })
	product_id?: number;

	@IsOptional()
	@IsString()
	@ApiProperty({ default: 'Batch name' })
	batch?: string;

	@IsOptional()
	@IsDateString()
	@ApiProperty({ default: 'Expiry date of the batch' })
	expiry_date?: Date;
}

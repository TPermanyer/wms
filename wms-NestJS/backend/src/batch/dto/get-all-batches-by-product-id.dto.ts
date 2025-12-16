import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class GetAllBatchesByProductIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_id!: number;
}

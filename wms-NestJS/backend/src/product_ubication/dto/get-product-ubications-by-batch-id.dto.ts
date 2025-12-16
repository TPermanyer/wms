import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetProductUbicationsByBatchIdDto {
	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	batch_id!: number;
}

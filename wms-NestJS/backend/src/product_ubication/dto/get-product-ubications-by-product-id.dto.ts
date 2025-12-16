import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetProductUbicationsByProductIdDto {
	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_id!: number;
}

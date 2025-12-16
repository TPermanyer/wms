import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetProductUbicationByIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_ubication_id!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ReceiveNewProductDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1, description: 'The ubication where the new product will be placed' })
	ubication_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1, description: 'The product ID' })
	product_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1, description: 'The batch ID' })
	batch_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 100, description: 'The amount of product received' })
	amount!: number;
}

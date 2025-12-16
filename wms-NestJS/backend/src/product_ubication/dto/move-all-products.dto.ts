import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MoveAllProductsDto {
	@ApiProperty({ example: 1, description: 'ID of the source ubication' })
	@IsNumber()
	from_ubication_id!: number;

	@ApiProperty({ example: 2, description: 'ID of the destination ubication' })
	@IsNumber()
	to_ubication_id!: number;
}

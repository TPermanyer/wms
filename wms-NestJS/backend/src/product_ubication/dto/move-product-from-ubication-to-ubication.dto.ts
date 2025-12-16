import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class MoveProductFromUbicationToUbicationDto {

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
	@ApiProperty({ default: 1 })
	from_ubication_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	to_ubication_id!: number;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 100 })
	amount!: number;


}

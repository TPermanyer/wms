import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ default: 'REF001' })
	reference!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ default: 'Product description' })
	description!: string;

	@IsNotEmpty()
	@IsBoolean()
	@ApiProperty({ default: false })
	obsolete!: boolean;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	company!: number;
}

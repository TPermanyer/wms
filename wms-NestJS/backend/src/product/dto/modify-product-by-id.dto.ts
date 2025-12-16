import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyProductByIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	product_id!: number;

	@IsOptional()
	@IsString()
	@ApiProperty({ default: 'REF001' })
	reference?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ default: 'Product description' })
	description?: string;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({ default: false })
	obsolete?: boolean;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	company?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUbicationDto {

	@IsOptional()
	@IsString()
	@ApiProperty({ default: 'A' })
	hallway?: string;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	position?: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	height?: number;

	@IsOptional()
	@IsInt()
	@ApiProperty({ default: 1 })
	depth?: number;
}

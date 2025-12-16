import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class EmptyUbicationDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	ubication_id!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetMovementLogsByUserIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	user_id!: number;
}

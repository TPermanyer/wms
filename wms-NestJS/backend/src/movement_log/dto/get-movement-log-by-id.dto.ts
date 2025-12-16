import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetMovementLogByIdDto {

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ default: 1 })
	movement_log_id!: number;
}

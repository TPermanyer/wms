import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
	@IsNotEmpty()
	@ApiProperty({
		example: "tomas",
	})
	username!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		default: 'Aa1!44452',
	})
	password!: string;
}
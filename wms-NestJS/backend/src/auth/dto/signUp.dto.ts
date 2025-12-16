import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
	@IsNotEmpty()
	@ApiProperty({
		example: "tomas",
	})
	username!: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
		{ "message": "password needs at least one uppercase letter, at least one lowercase letter and at least one number or special character" })
	@ApiProperty({
		default: 'Aa1!44452',
	})
	password!: string;
}
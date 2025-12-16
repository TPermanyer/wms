import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		@InjectEntityManager() private readonly em: EntityManager,
	) { }

	@Post('signUpUser')
	@ApiOperation({ summary: 'Create a new user and return JWT' })
	@ApiBody({ type: SignUpDto })
	async signUp(@Body() dto: SignUpDto): Promise<{ accessToken: string }> {
		return this.em.transaction((manager) =>
			this.authService.signUpUser(manager, dto.username, dto.password),
		);
	}

	@Post('signInUser')
	@ApiOperation({ summary: 'Sign in and return JWT' })
	@ApiBody({ type: SignInDto })
	async signInUser(@Body() dto: SignInDto): Promise<{ accessToken: string }> {
		return this.em.transaction((manager) =>
			this.authService.signInUser(manager, dto.username, dto.password),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Get('getMe')
	@ApiBearerAuth('bearer')
	@ApiOperation({ summary: 'Get current user profile' })
	async getMe(@Req() req: any) {
		return req.user;
	}
}

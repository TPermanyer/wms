import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EntityManager, ForbiddenTransactionModeOverrideError } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) { }

	async validateUser(manager: EntityManager, username: string, password: string) {
		const user = await this.userService.findByUsername(manager, username);
		if (!user) return null;
		const ok = await bcrypt.compare(password, user.passwordHash);
		return ok ? user : null;
	}

	async signInUser(manager: EntityManager, username: string, password: string) {
		const user = await this.validateUser(manager, username, password);
		if (!user) throw new UnauthorizedException('Invalid credentials');
		const payload = { sub: user.id, username: user.username };
		const accessToken = await this.jwtService.signAsync(payload);
		return { accessToken };
	}

	async signUpUser(manager: EntityManager, username: string, password: string) {
		const exists = await this.userService.findByUsername(manager, username);
		if (exists) {
			throw new ForbiddenException('Username already exists');
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await this.userService.create(manager, username, passwordHash);
		const payload = { sub: user.id, username: user.username };
		const accessToken = await this.jwtService.signAsync(payload);
		return { accessToken };
	}
}

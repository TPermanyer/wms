import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
	async findByUsername(manager: EntityManager, username: string): Promise<User | undefined> {
		const found = await manager.findOne(User, { where: { username } });
		return found ?? undefined;
	}

	async findById(manager: EntityManager, id: number): Promise<User | undefined> {
		const found = await manager.findOne(User, { where: { id } });
		return found ?? undefined;
	}

	async create(manager: EntityManager, username: string, passwordHash: string): Promise<User> {
		const exists = await manager.findOne(User, { where: { username } });
		if (exists) {
			throw new Error('Username already exists');
		}
		const user = manager.create(User, { username, passwordHash, roles: ['user'] });
		return await manager.save(user);
	}
}

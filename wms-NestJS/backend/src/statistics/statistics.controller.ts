import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly service: StatisticsService) { }

	@Get('dashboard')
	@ApiOperation({ summary: 'Get dashboard statistics' })
	async getDashboardStats() {
		return await this.service.getDashboardStats();
	}

	@Get('expiring-products')
	@ApiOperation({ summary: 'Get products expiring within 6 months' })
	async getExpiringProducts() {
		return await this.service.getExpiringProducts();
	}
}

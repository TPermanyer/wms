import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementLogService } from './movement_log.service';
import { MovementLogController } from './movement_log.controller';
import { MovementLog } from './movement_log.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MovementLog])],
	providers: [MovementLogService],
	controllers: [MovementLogController],
	exports: [MovementLogService],
})
export class MovementLogModule { }

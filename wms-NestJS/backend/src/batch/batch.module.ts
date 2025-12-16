import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { Batch } from './batch.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Batch])],
	providers: [BatchService],
	controllers: [BatchController],
	exports: [BatchService],
})
export class BatchModule { }

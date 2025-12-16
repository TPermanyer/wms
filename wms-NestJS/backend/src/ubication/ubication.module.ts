import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicationService } from './ubication.service';
import { UbicationController } from './ubication.controller';
import { Ubication } from './ubication.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Ubication])],
	providers: [UbicationService],
	controllers: [UbicationController],
	exports: [UbicationService],
})
export class UbicationModule { }

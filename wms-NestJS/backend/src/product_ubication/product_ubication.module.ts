import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUbicationService } from './product_ubication.service';
import { ProductUbicationController } from './product_ubication.controller';
import { ProductUbication } from './product_ubication.entity';
import { MovementLogModule } from '../movement_log/movement_log.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ProductUbication]),
		forwardRef(() => MovementLogModule),
	],
	providers: [ProductUbicationService],
	controllers: [ProductUbicationController],
	exports: [ProductUbicationService],
})
export class ProductUbicationModule { }

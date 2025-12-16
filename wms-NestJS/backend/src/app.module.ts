import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { UbicationModule } from './ubication/ubication.module';
import { ProductUbicationModule } from './product_ubication/product_ubication.module';
import { User } from './user/user.entity';
import { BatchModule } from './batch/batch.module';
import { MovementLogModule } from './movement_log/movement_log.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: 'mysql',
				host: process.env.DB_HOST || 'localhost',
				port: Number(process.env.DB_PORT || 3306),
				username: process.env.DB_USER || 'root',
				password: process.env.DB_PASS || 'GiZv0F4u3QR1veuK',
				database: process.env.DB_NAME || 'wms',
				autoLoadEntities: true,
				synchronize: true,
				entities: [User],
			}),
		}),
		UserModule,
		AuthModule,
		ProductModule,
		UbicationModule,
		ProductUbicationModule,
		BatchModule,
		MovementLogModule,
		StatisticsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }

import 'reflect-metadata';
// Force restart 5
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:3007',
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: false,
		transform: true,
	}));

	const config = new DocumentBuilder()
		.setTitle('WMS API')
		.setDescription('API documentation')
		.setVersion('1.0')
		.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	const port = process.env.PORT ? Number(process.env.PORT) : 3000;
	await app.listen(port);
	console.log(`Backend listening on http://localhost:${port}`);
	console.log(`Swagger link on http://localhost:${port}/api/`);
	console.log('Backend restarted successfully!');
}

bootstrap();

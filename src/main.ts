import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.enableCors({
		credentials: true,
		origin: process.env.APP_URL,
	})
	app.setGlobalPrefix('api')
	await app.listen(4200)
}
bootstrap()

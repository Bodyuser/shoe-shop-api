import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.setGlobalPrefix('api')
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', process.env.APP_DOMEN)
		res.header(
			'Access-Control-Allow-Methods',
			'GET,PUT,POST,DELETE,OPTIONS,PATCH'
		)
		res.header('Access-Control-Max-Age', 86400)
		res.header('Access-Control-Allow-Headers', 'Content-Type')
		res.header('Access-Control-Allow-Credentials', 'true')
		next()
	})
	app.enableCors({
		origin: process.env.APP_DOMEN,
		credentials: true,
	})
	await app.listen(4200)
}
bootstrap()

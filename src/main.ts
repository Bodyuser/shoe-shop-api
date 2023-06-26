import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.setGlobalPrefix('api')
	app.use((req, res, next) => {
		res.header(
			'Access-Control-Allow-Origin',
			'venerable-cascaron-f5e9d5.netlify.app'
		)
		res.header(
			'Access-Control-Allow-Methods',
			'GET,PUT,POST,DELETE,OPTIONS,PATCH'
		)
		res.header('Access-Control-Max-Age', 86400)
		res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
		res.header('Access-Control-Allow-Credentials', 'true')
		next()
	})
	app.enableCors({
		origin: 'venerable-cascaron-f5e9d5.netlify.app',
		credentials: true,
	})
	await app.listen(4200)
}
bootstrap()

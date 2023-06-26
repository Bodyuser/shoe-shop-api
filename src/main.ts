import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.enableCors({
		credentials: true,
		origin: "*",
	})
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header(
			'Access-Control-Allow-Methods',
			'GET,PUT,POST,DELETE,OPTIONS,PATCH'
		)
		res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
		next()
	})
	app.setGlobalPrefix('api')
	await app.listen(4200)
}
bootstrap()

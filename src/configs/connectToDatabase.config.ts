import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const connectToDatabase = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	port: 5432,
	type: 'postgres',
	host: await configService.get('DB_HOST'),
	username: await configService.get('DB_USERNAME'),
	password: await configService.get<string>('DB_PASSWORD'),
	database: await configService.get<string>('DB_DATABASE'),
	synchronize: true,
	autoLoadEntities: true,
	keepConnectionAlive: true,
})

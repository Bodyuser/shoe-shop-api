import { connectJWT } from '@/configs/connectJWT.config'
import { SendMailModule } from '@/send-mail/send-mail.module'
import { JwtStrategy } from '@/strategies/jwt.strategy'
import { UserEntity } from '@/users/entities/user.entity'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy],
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserEntity]),
		SendMailModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: connectJWT,
		}),
	],
})
export class UsersModule {}

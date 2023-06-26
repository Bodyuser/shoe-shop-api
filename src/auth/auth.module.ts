import { connectJWT } from '@/configs/connectJWT.config'
import { SendMailModule } from '@/send-mail/send-mail.module'
import { JwtStrategy } from '@/strategies/jwt.strategy'
import { UserEntity } from '@/users/entities/user.entity'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: connectJWT,
		}),
		SendMailModule,
	],
})
export class AuthModule {}

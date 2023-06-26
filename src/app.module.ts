import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { connectMailer } from './configs/connectMailer.config'
import { connectToDatabase } from './configs/connectToDatabase.config'
import { SendMailModule } from './send-mail/send-mail.module'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { ProductsModule } from './products/products.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: connectToDatabase,
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: connectMailer,
		}),
		AuthModule,
		UsersModule,
		SendMailModule,
		FilesModule,
		ProductsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}

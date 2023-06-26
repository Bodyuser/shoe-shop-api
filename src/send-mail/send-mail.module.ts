import { UserEntity } from '@/users/entities/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SendMailController } from './send-mail.controller'
import { SendMailService } from './send-mail.service'

@Module({
	controllers: [SendMailController],
	providers: [SendMailService],
	exports: [SendMailService],
	imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class SendMailModule {}

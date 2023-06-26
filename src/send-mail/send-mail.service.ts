import { SendMailDto } from '@/send-mail/dtos/send-mail.dto'
import { UserEntity } from '@/users/entities/user.entity'
import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class SendMailService {
	constructor(
		private mailerService: MailerService,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
	) {}

	async sendMailForActivateUser(email: string, link?: string) {
		return await this.mailerService.sendMail({
			to: email,
			from: 'skacat915@gmail.com',
			subject: `${process.env.APP_URL}/users/activated/${link}`,
		})
	}

	async sendMailForResetPassword(sendMailDto: SendMailDto) {
		const user = await this.userRepository.findOne({
			where: { email: sendMailDto.email },
		})
		if (!user)
			throw new BadRequestException('User with this email does not exist')
		return await this.mailerService.sendMail({
			to: sendMailDto.email,
			from: 'skacat915@gmail.com',
			subject: `${process.env.APP_URL}/reset/${user.resetLink}`,
		})
	}

	async sendMailForConfirmCode(email: string, code: number) {
		return await this.mailerService.sendMail({
			to: email,
			from: 'skacat915@gmail.com',
			subject: `Code for confirm actions ${code}`,
		})
	}
}

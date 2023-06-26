import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const connectMailer = async (
	configService: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: await configService.get('MAIL_HOST'),
		auth: {
			user: await configService.get('MAIL_USER'),
			pass: await configService.get('MAIL_PASS'),
		},
	},
})

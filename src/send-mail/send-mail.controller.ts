import { SendMailDto } from '@/send-mail/dtos/send-mail.dto'
import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { SendMailService } from './send-mail.service'

@Controller('send-mail')
export class SendMailController {
	constructor(private readonly sendMailService: SendMailService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('reset')
	async sendMailForResetPassword(@Body() sendMailDto: SendMailDto) {
		await this.sendMailService.sendMailForResetPassword(sendMailDto)
		return {
			message: 'An email with instructions has been sent to you.',
		}
	}
}

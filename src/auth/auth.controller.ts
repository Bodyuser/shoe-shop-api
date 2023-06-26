import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto'
import { SignInDto } from '@/auth/dtos/sign-in.dto'
import { SignUpDto } from '@/auth/dtos/sign-up.dto'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Req,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('signup')
	async signUp(
		@Body() signUpDto: SignUpDto,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.signUp(signUpDto)
		response.cookie('refreshToken', data.tokens.refreshToken, {
			httpOnly: true,
			maxAge: 15 * 24 * 60 * 60 * 1000,
			path: '/api',
		})
		return {
			user: data.user,
			token: data.tokens.accessToken,
		}
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('signin')
	async signIn(
		@Body() signInDto: SignInDto,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.signIn(signInDto)
		response.cookie('refreshToken', data.tokens.refreshToken, {
			httpOnly: true,
			maxAge: 15 * 24 * 60 * 60 * 1000,
			path: '/api',
		})
		return {
			user: data.user,
			token: data.tokens.accessToken,
		}
	}

	@HttpCode(200)
	@Get('token')
	async getNewTokens(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response
	) {
		const refreshToken = request.cookies.refreshToken

		const data = await this.authService.getNewTokens(refreshToken)
		response.cookie('refreshToken', data.tokens.refreshToken, {
			httpOnly: true,
			maxAge: 15 * 24 * 60 * 60 * 1000,
			path: '/api',
		})
		return {
			user: data.user,
			token: data.tokens.accessToken,
		}
	}

	@HttpCode(200)
	@Post('reset/:resetLink')
	async resetPassword(
		@Body() resetPasswordDto: ResetPasswordDto,
		@Param('resetLink') resetLink: string
	) {
		return await this.authService.resetPassword(resetLink, resetPasswordDto)
	}

	@HttpCode(200)
	@Get('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('refreshToken', { path: '/api' })
		return
	}

	@Get('reset/:resetLink')
	async checkResetLink(@Param('resetLink') resetLink: string) {
		return await this.authService.checkResetLink(resetLink)
	}
}

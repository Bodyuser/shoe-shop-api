import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, genSalt, hash } from 'bcryptjs'
import { SignUpDto } from './dtos/sign-up.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { UserEntity } from '@/users/entities/user.entity'
import { Repository } from 'typeorm'
import { generateCode } from '@/utils/generateCode'
import { generateUsername } from '@/utils/generateUsername'
import { SendMailService } from '@/send-mail/send-mail.service'
import { correctReturnUser } from '@/utils/correctReturnUser'
import { v4 } from 'uuid'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private jwtService: JwtService,
		private sendMailService: SendMailService
	) {}

	async signUp(signUpDto: SignUpDto) {
		const existingUser = await this.findByEmail(signUpDto.email)
		if (existingUser)
			throw new BadRequestException('User with this email exists')

		const salt = await genSalt(10)
		const user = await this.userRepository.create({
			...signUpDto,
			password: await hash(signUpDto.password, salt),
		})

		user.code = generateCode()
		user.username = generateUsername(user.name, user.email)

		await this.userRepository.save(user)

		await this.sendMailService.sendMailForActivateUser(
			user.email,
			user.activateLink
		)

		const tokens = await this.createTokens(user.id)

		return {
			user: correctReturnUser(user),
			tokens,
		}
	}

	async signIn(signInDto: SignInDto) {
		const user = await this.validateUser(signInDto.email, signInDto.password)

		const tokens = await this.createTokens(user.id)

		return {
			user: correctReturnUser(user),
			tokens,
		}
	}

	async getNewTokens(refreshToken: string) {
		if (!refreshToken)
			throw new UnauthorizedException(
				'You are not registered or not logged in, please login'
			)

		const payload = await this.jwtService.verifyAsync(refreshToken, {
			ignoreExpiration: true,
			ignoreNotBefore: true,
		})

		if (!payload.id)
			throw new UnauthorizedException(
				'The token has expired or the token is invalid'
			)

		const user = await this.userRepository.findOne({
			where: { id: payload.id },
		})
		if (!user)
			throw new BadRequestException('User with this email does not exist')

		const tokens = await this.createTokens(user.id)

		return {
			user: correctReturnUser(user),
			tokens,
		}
	}

	async resetPassword(resetLink: string, resetPasswordDto: ResetPasswordDto) {
		const user = await this.userRepository.findOne({ where: { resetLink } })
		if (!user)
			throw new BadRequestException('User with this reset link does not exist')

		const salt = await genSalt(10)

		user.password = await hash(resetPasswordDto.password, salt)
		user.resetLink = v4()

		await this.userRepository.save(user)

		return {
			message: 'Password changed successfully',
		}
	}

	async checkResetLink(resetLink: string) {
		const user = await this.userRepository.findOne({ where: { resetLink } })
		if (!user)
			throw new BadRequestException('User with this reset link does not exist')

		return {
			message: 'You can change password',
		}
	}

	async findByEmail(email: string) {
		return this.userRepository.findOne({ where: { email } })
	}

	async createTokens(userId: number) {
		const payload = {
			id: userId,
		}
		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: '15d',
		})
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '5m',
		})
		return {
			accessToken,
			refreshToken,
		}
	}

	async validateUser(email: string, password: string) {
		const user = await this.findByEmail(email)
		if (!user)
			throw new BadRequestException('User with this email does not exist')

		const isValidPassword = await compare(password, user.password)
		if (!isValidPassword)
			throw new BadRequestException('Invalid email or password')

		return user
	}
}

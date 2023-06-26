import { SendMailService } from '@/send-mail/send-mail.service'
import { UpdateProfileDto } from '@/users/dtos/update-profile.dto'
import { UserEntity } from '@/users/entities/user.entity'
import { correctReturnUser } from '@/utils/correctReturnUser'
import { generateCode } from '@/utils/generateCode'
import { globalReturnUser } from '@/utils/globalReturnUser'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, genSalt, hash } from 'bcryptjs'
import { ILike, Repository } from 'typeorm'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private sendMailService: SendMailService
	) {}

	async getAllUsers(searchTerm?: string) {
		const options = {
			email: searchTerm ? searchTerm : '',
		}
		const users = await this.userRepository.find({
			where: { email: ILike(`%${options.email}%`) },
		})
		return users.map(user => globalReturnUser(user))
	}

	async getUserByUsername(username: string) {
		const user = await this.userRepository.findOne({
			where: { username },
		})
		if (!user) throw new NotFoundException('User not found')
		return globalReturnUser(user)
	}

	async getProfile(username: string) {
		const user = await this.userRepository.findOne({ where: { username } })
		if (!user)
			throw new UnauthorizedException('User not found or you are not logged in')
		return {
			user: correctReturnUser(user),
		}
	}

	async updateProfile(username: string, updateProfileDto: UpdateProfileDto) {
		const user = await this.userRepository.findOne({ where: { username } })
		if (!user)
			throw new UnauthorizedException('User not found or you are not logged in')
		if (
			updateProfileDto.email &&
			(!updateProfileDto.code || updateProfileDto.code === 0) &&
			updateProfileDto.email !== user.email
		) {
			await this.sendMailService.sendMailForConfirmCode(user.email, user.code)
			throw new BadRequestException(
				'Enter the code that was sent to your email'
			)
		}
		if (
			updateProfileDto.code &&
			updateProfileDto.code !== 0 &&
			updateProfileDto.email !== user.email &&
			updateProfileDto.email
		) {
			const validUser = await this.userRepository.findOne({
				where: { code: updateProfileDto.code },
			})
			if (!validUser) throw new BadRequestException('Enter the correct code')
			const valid = validUser.code === user.code
			if (!valid)
				throw new BadRequestException(
					'Enter the valid code that was sent to your email'
				)
			const existingUserByEmail = await this.userRepository.findOne({
				where: { email: updateProfileDto.email },
			})
			if (existingUserByEmail)
				throw new BadRequestException('The user with this email is busy')
		}
		if (user) {
			if (updateProfileDto.password) {
				if (updateProfileDto.currentPassword) {
					const validCurrentPassword = await compare(
						updateProfileDto.currentPassword,
						user.password
					)
					if (!validCurrentPassword)
						throw new BadRequestException('Enter the correct current password')
					else if (updateProfileDto.password && validCurrentPassword) {
						const salt = await genSalt(10)
						user.password = await hash(updateProfileDto.password, salt)
					} else throw new BadRequestException('Enter the password')
				} else throw new BadRequestException('Enter the current password')
			}
			if (
				updateProfileDto.username &&
				user.username !== updateProfileDto.username
			) {
				const existingUserBySlug = await this.userRepository.findOne({
					where: { username: updateProfileDto.username },
				})
				if (existingUserBySlug)
					throw new BadRequestException('The user with this username is busy')
				updateProfileDto.username
					? (user.username = updateProfileDto.username)
					: (user.username = user.username)
			}
			updateProfileDto.email
				? (user.email = updateProfileDto.email)
				: (user.email = user.email)
			updateProfileDto.avatarPath
				? (user.avatarPath = updateProfileDto.avatarPath)
				: (user.avatarPath = user.avatarPath)
			updateProfileDto.name
				? (user.name = updateProfileDto.name)
				: (user.name = user.name)
			user.code = generateCode()
			await this.userRepository.save(user)
			if (user.email === updateProfileDto.email) {
				await this.sendMailService.sendMailForActivateUser(
					user.email,
					user.activateLink
				)
			}
			return {
				user: correctReturnUser(user),
			}
		}
	}

	async deleteProfile(id: number) {
		const user = await this.userRepository.findOne({
			where: { id },
		})
		if (!user)
			throw new UnauthorizedException('User not found or you are not logged in')
		if (user) await this.userRepository.delete(user.id)
		return {
			message: 'Profile deleted',
		}
	}

	async activateUser(activateLink: string) {
		const user = await this.userRepository.findOne({ where: { activateLink } })
		if (!user)
			throw new UnauthorizedException('User not found or you are not logged in')
		if (user.isActivated)
			return {
				message: 'User already activated',
			}
		user.isActivated = true
		if (user.activateLink) user.activateLink = ''
		await this.userRepository.save(user)
		return {
			message: 'Profile has been activated',
		}
	}

	async checkExistingSlug(username: string, userUsername: string) {
		if (username !== userUsername) {
			const options = {
				username: username ? username : '',
			}
			const userBySlug = await this.userRepository.find({
				where: {
					username: ILike(`${options.username}`),
				},
			})
			if (userBySlug.length) {
				return {
					message: 'This user by username existing',
					access: false,
				}
			}
			return {
				message: 'This username is not busy',
				access: true,
			}
		} else {
			return {
				message: 'This username is yours',
				access: true,
			}
		}
	}
}

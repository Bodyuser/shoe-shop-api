import { Auth } from '@/auth/decorators/auth.decorator'
import { User } from '@/users/decorators/user.decorator'
import { UpdateProfileDto } from '@/users/dtos/update-profile.dto'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Put,
	Query,
} from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('')
	async getAllUsers(@Query('searchTerm') searchTerm?: string) {
		return await this.usersService.getAllUsers(searchTerm)
	}

	@Get('profile')
	@Auth()
	async getProfile(@User('username') username: string) {
		return await this.usersService.getProfile(username)
	}

	@Put('profile')
	@Auth()
	async updateProfile(
		@User('username') username: string,
		@Body() updateProfileDto: UpdateProfileDto
	) {
		return this.usersService.updateProfile(username, updateProfileDto)
	}

	@Delete('profile')
	@Auth()
	async deleteProfile(@User('id') id: number) {
		return await this.usersService.deleteProfile(id)
	}

	@Get('activate/:activateLink')
	@Auth()
	async activatedUser(@Param('activateLink') activateLink: string) {
		return this.usersService.activateUser(activateLink)
	}

	@Get('existing-username')
	@Auth()
	async checkExistingSlug(
		@Query('username') username: string,
		@User('username') userUsername: string
	) {
		return this.usersService.checkExistingSlug(username, userUsername)
	}

	@Get(':username')
	async getUserByUsername(@Param('username') username: string) {
		return await this.usersService.getUserByUsername(username)
	}
}

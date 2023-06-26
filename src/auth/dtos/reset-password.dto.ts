import { IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
	@MinLength(8, {
		message: 'Password must be at least 8 characters',
	})
	@IsString({ message: 'Password field must be a string' })
	password: string
}

import { IsEmail, IsString, MinLength } from 'class-validator'

export class SignInDto {
	@IsEmail({}, { message: 'Email field must be a correct format' })
	@IsString({ message: 'Email field must be a string' })
	email: string

	@MinLength(8, {
		message: 'Password must be at least 8 characters',
	})
	@IsString({ message: 'Password field must be a string' })
	password: string
}

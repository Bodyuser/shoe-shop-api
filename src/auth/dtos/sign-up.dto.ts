import { IsEmail, IsString, MinLength } from 'class-validator'

export class SignUpDto {
	@IsEmail({}, { message: 'Email field must be a correct format' })
	@IsString({ message: 'Email field must be a string' })
	email: string

	@IsString({ message: 'Name field must be a string' })
	name: string

	@MinLength(8, {
		message: 'Password must be at least 8 characters',
	})
	@IsString({ message: 'Password field must be a string' })
	password: string
}

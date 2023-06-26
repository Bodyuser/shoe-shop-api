import { IsNumber, IsString } from 'class-validator'

export class CreateProductDto {
	@IsString({ message: 'Title field must be a string' })
	title: string

	@IsString({ message: 'Model field must be a string' })
	model: string

	@IsString({ message: 'Background field must be a string' })
	backgroundColor: string

	@IsString({ message: 'Brand field must be a string' })
	brand: string

	@IsString({ message: 'ImagePath field must be a string' })
	imagePath: string

	@IsNumber({}, { message: 'Price field must be a number' })
	price: number
}

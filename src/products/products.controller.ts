import { IOptionsProduct, IOptionsProductDto } from './products.interface'
import {
	Controller,
	Body,
	Post,
	HttpCode,
	UsePipes,
	Get,
	Query,
	ValidationPipe,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dtos/create-product.dto'
import { Auth } from '@/auth/decorators/auth.decorator'
import { UserRole } from '@/shared/enum/UserRole.enum'
import { User } from '@/users/decorators/user.decorator'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@HttpCode(200)
	@Auth(UserRole.ADMIN)
	@Post('create')
	@UsePipes(new ValidationPipe())
	async CreateProduct(
		@Body() createProductDto: CreateProductDto,
		@User('id') userId: number
	) {
		return await this.productsService.CreateProduct(createProductDto, userId)
	}

	@Post()
	@HttpCode(200)
	async GetAll(@Body() productOptions?: IOptionsProductDto) {
		console.log(productOptions)
		return await this.productsService.GetAll(productOptions)
	}
}

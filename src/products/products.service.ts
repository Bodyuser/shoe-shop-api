import { CreateProductDto } from './dtos/create-product.dto'
import { UserEntity } from '@/users/entities/user.entity'
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, And, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm'
import { ProductEntity } from './entities/product.entity'
import { generateCode } from '@/utils/generateCode'
import { generateSlug } from '@/utils/generateSlug'
import { IOptionsProduct } from './products.interface'

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(ProductEntity)
		private productRepository: Repository<ProductEntity>,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	) {}

	async CreateProduct(createProductDto: CreateProductDto, userId: number) {
		const existingProductModel = await this.productRepository.findOne({
			where: { model: createProductDto.model },
		})
		const existingProductTitle = await this.productRepository.findOne({
			where: { title: createProductDto.title },
		})
		if (existingProductModel || existingProductTitle)
			throw new BadRequestException(
				`Product with this ${existingProductModel ? 'model' : 'title'} exists`
			)
		const user = await this.userRepository.findOne({ where: { id: userId } })
		const slug = await generateSlug(
			createProductDto.title,
			createProductDto.model
		)
		const product = await this.productRepository.create({
			...createProductDto,
			user: user,
			slug,
		})
		await this.productRepository.save(product)
		return product
	}

	async GetAll(productOption?: IOptionsProduct) {
		const priceOptions =
			productOption.price?.min && productOption.price?.max
				? And(
						MoreThanOrEqual(productOption.price?.min),
						LessThanOrEqual(productOption.price?.max)
				  )
				: productOption.price?.min
				? MoreThanOrEqual(productOption.price?.min)
				: productOption.price?.max
				? LessThanOrEqual(productOption.price?.max)
				: MoreThanOrEqual(0)

		return await this.productRepository.find({
			where:
				productOption.price?.min || productOption.price?.max
					? {
							price: priceOptions,
							brand: productOption.brand && In(productOption.brand),
					  }
					: productOption.brand
					? {
							brand: productOption.brand && In(productOption.brand),
					  }
					: {},
			order: {
				createdAt: productOption.created === 'new' ? 'DESC' : 'ASC',
			},
			relations: {
				user: true,
			},
		})
	}
}

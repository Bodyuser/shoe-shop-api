import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities/product.entity'
import { UserEntity } from '@/users/entities/user.entity'

@Module({
	controllers: [ProductsController],
	providers: [ProductsService],
	imports: [TypeOrmModule.forFeature([ProductEntity, UserEntity])],
})
export class ProductsModule {}

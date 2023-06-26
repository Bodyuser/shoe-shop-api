import { UserEntity } from '@/users/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class ProductEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	title: string

	@Column({ unique: true })
	model: string

	@ManyToOne(() => UserEntity, user => user.products, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@Column({ name: 'background_color' })
	backgroundColor: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@Column()
	brand: string

	@Column({ unique: true })
	slug: string

	@Column()
	price: number

	@Column({
		default: '/uploads/defaults/product/product.png',
		name: 'image_path',
	})
	imagePath: string
}

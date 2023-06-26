import { ProductEntity } from '@/products/entities/product.entity'
import { UserRole } from '@/shared/enum/UserRole.enum'
import {
	Column,
	CreateDateColumn,
	Entity,
	Generated,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	username: string

	@Column({ unique: true })
	email: string

	@Column()
	password: string

	@Column()
	name: string

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@Generated('uuid')
	@Column({ name: 'activate_link' })
	activateLink: string

	@Generated('uuid')
	@Column({ name: 'reset_link' })
	resetLink: string

	@Column()
	code: number

	@Column({ default: false, name: 'is_activated' })
	isActivated: boolean

	@Column({ default: '/uploads/defaults/user/user.png', name: 'avatar_path' })
	avatarPath: string

	@OneToMany(() => ProductEntity, product => product.user)
	products: ProductEntity[]
}

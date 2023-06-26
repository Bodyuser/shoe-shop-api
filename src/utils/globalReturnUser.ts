import { UserEntity } from '@/users/entities/user.entity'

export const globalReturnUser = (user: UserEntity) => {
	return {
		id: user.id,
		name: user.name,
		username: user.username,
		role: user.role,
		createdAt: user.createdAt,
		avatarPath: user.avatarPath,
		updatedAt: user.updatedAt,
		products: user.products,
	}
}

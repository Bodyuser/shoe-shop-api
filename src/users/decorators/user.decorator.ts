import { UserEntity } from '@/users/entities/user.entity'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

type TypeUser = keyof UserEntity

export const User = createParamDecorator(
	(data: TypeUser, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()

		const user = request.user

		return data ? user[data] : user
	}
)

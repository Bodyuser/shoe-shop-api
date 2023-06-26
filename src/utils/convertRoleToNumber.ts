import { UserRole } from '@/shared/enum/UserRole.enum'

export const convertRoleToNumber = (userRole: string) => {
	return userRole === UserRole.ADMIN ? 2 : userRole === UserRole.USER ? 1 : 0
}

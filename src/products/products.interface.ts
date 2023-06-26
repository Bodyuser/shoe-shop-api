export interface IOptionsProduct {
	brand?: string[]
	price?: {
		min?: number
		max?: number
	}
	created?: 'old' | 'new'
}

export class IOptionsProductDto {
	brand?: string[]
	price?: {
		min?: number
		max?: number
	}
	created?: 'old' | 'new'
}

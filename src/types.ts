export interface Ad {
	uuid: string
	title: string
	price: number
	currency: string
	city: string
	image?: string
	category_id: number
	created_at: string
}

export interface AdDetail {
	uuid: string
	title: string
	price: number
	currency: string
	city: string
	description: string
	is_owner?: boolean,
	images: string[]
	created_at: string
}

export interface ImageItem {
	id: string // Уникальный ID для React key
	file: File | null // Сам файл для отправки
	preview: string // URL для отображения (blob:...)
	isServer?: boolean
}

export interface CategoryItem {
	id: number
	name: string
	icon: string
}

export interface Ad {
	id: number
	title: string
	price: number // С бэкенда цена чаще приходит числом (например 100000)
	currency: string // Например 'VND' или 'RUB'
	city: string // Город
	image_url?: string // Ссылка на фото. Если нет — покажем заглушку
	category_id?: number
	created_at?: string
}

export interface AdDetail {
	id: number
	title: string
	price: number // С бэкенда цена чаще приходит числом (например 100000)
	currency: string // Например 'VND' или 'RUB'
	city: string // Город
	description: string
	photos: string[] // Массив ссылок (или Base64 строк)
	created_at: string
}

export interface ImageItem {
	id: string // Уникальный ID для React key
	file: File // Сам файл для отправки
	preview: string // URL для отображения (blob:...)
}

export interface CategoryItem {
	id: number
	name: string
	icon: string
}

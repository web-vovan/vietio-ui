export interface Ad {
	id: number
	title: string
	price: number // С бэкенда цена чаще приходит числом (например 100000)
	currency: string // Например 'VND' или 'RUB'
	city: string // Город
	category_id?: string // ID категории (необязательно, вдруг с бэка не придет)
	image_url?: string // Ссылка на фото. Если нет — покажем заглушку
	created_at?: string // Дата создания
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

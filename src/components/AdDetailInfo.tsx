import { List, Section, Text } from "@telegram-apps/telegram-ui"
import { Calendar, MapPin } from "lucide-react"

type AdDetailInfoProp = {
    price: number
    title: string
    description: string
    date: string
    city: string
}

// Формат цены
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price)
}

// Формат даты
const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export const AdDetailInfo = ({
	price,
	title,
	description,
	date,
	city,
}: AdDetailInfoProp) => {
	return (
		<List style={{ marginTop: 0, background: 'transparent' }}>
			{/* Основная инфа: Цена и Название */}
			<Section>
				<div style={{ padding: '16px 20px' }}>
					<Text
						weight='1'
						style={{
							fontSize: 28,
							lineHeight: '34px',
							color: 'var(--tgui--text_color)',
						}}
					>
						{formatPrice(price)}
					</Text>
					<Text
						weight='2'
						style={{ fontSize: 20, marginTop: 8, display: 'block' }}
					>
						{title}
					</Text>

					<div
						style={{
							display: 'flex',
							gap: 16,
							marginTop: 12,
							color: 'var(--tgui--hint_color)',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
							<MapPin size={16} />
							<Text style={{ fontSize: 14 }}>{city}</Text>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
							<Calendar size={16} />
							<Text style={{ fontSize: 14 }}>{formatDate(date)}</Text>
						</div>
					</div>
				</div>
			</Section>
			{/* Описание */}
			<Section header='Описание'>
				<div style={{ padding: '0 20px 16px 20px', whiteSpace: 'pre-wrap' }}>
					<Text style={{ fontSize: 16, lineHeight: '24px' }}>
						{description}
					</Text>
				</div>
			</Section>
		</List>
	)
}
import { List, Section, Text } from "@telegram-apps/telegram-ui"
import { Calendar, MapPin } from "lucide-react"
import { formatPrice } from '../helpers/priceHelper'

type AdDetailInfoProp = {
    price: number
    title: string
    description: string
    date: string
    city: string
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
					{price === 0 ? (
						<Text
							weight='2'
							style={{
								fontSize: 28,
								lineHeight: '22px',
								marginBottom: 4,
								fontWeight: 700,
							}}
						>
							<span
								style={{
									background:
										'linear-gradient(90deg, #16a34a 0%, #0ea5e9 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								free
							</span>
						</Text>
					) : (
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
					)}

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

			<div>
				<div style={{ padding: '0 20px 16px 20px', whiteSpace: 'pre-wrap' }}>
					<Text style={{ fontSize: 16, lineHeight: '24px' }}>
						{description}
					</Text>
				</div>
			</div>
		</List>
	)
}
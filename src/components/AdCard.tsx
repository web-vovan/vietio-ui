import { useNavigate } from 'react-router-dom'

import { Caption, Card, Text, Subheadline } from '@telegram-apps/telegram-ui'
import { Ad } from '../types'

type EmptySearchProps = {
	item: Ad
}

const formatPrice = (price: number, currency: string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: currency,
	}).format(price)
}

export const AdCard = ({ item }: EmptySearchProps) => {
	const navigate = useNavigate()

	return (
		<Card
			key={item.uuid}
			onClick={() => navigate(`/ads/${item.uuid}`)}
			style={{
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				cursor: 'pointer',
			}}
		>
			{/* Блок с картинкой */}
			<div
				style={{
					height: 120,
					width: '100%',
					backgroundColor: '#eee', // Серый фон пока грузится картинка
					position: 'relative',
				}}
			>
				{item.image ? (
					<img
						src={item.image}
						alt={item.title}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				) : (
					// Если картинки нет — показываем первую букву на цветном фоне
					<div
						style={{
							width: '100%',
							height: '100%',
							background: '#8E8E93',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#fff',
							fontSize: 24,
						}}
					>
						{item.title[0]}
					</div>
				)}
			</div>

			<div style={{ padding: '10px 12px' }}>
				{/* Цена (отформатированная) */}
				<Text weight='3' style={{ display: 'block', marginBottom: 4 }}>
					{formatPrice(item.price, item.currency)}
				</Text>

				<Subheadline level='2' weight='2' style={{ marginBottom: 4 }}>
					{item.title}
				</Subheadline>

				<Caption
					level='1'
					weight='3'
					style={{ color: 'var(--tgui--hint_color)' }}
				>
					{item.city}
				</Caption>
			</div>
		</Card>
	)
}

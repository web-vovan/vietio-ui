import { useNavigate } from 'react-router-dom'
import {  Image as ImageIcon } from 'lucide-react'
import { Caption, Card, Text, Subheadline } from '@telegram-apps/telegram-ui'
import { Ad } from '../types'
import { formatPrice } from '../helpers/helper'

type AdCardProps = {
	item: Ad
}

export const AdCard = ({ item }: AdCardProps) => {
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
				borderRadius: 20,
				background: 'var(--tgui--bg_color)',
				boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
				border: 'none',
			}}
		>
			<div
				style={{
					aspectRatio: '1 / 1',
					width: '100%',
					backgroundColor: 'var(--tgui--secondary_bg_color)',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{item.image ? (
					<>
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								zIndex: 0,
							}}
						/>

						<img
							src={item.image}
							alt={item.title}
							style={{
								position: 'relative',
								zIndex: 1,
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								transition: 'transform 0.3s ease',
							}}
						/>
					</>
				) : (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'var(--tgui--hint_color)',
							zIndex: 1,
							position: 'relative',
						}}
					>
						<ImageIcon size={32} />
					</div>
				)}
			</div>

			<div style={{ padding: '10px 10px 12px 10px' }}>
				{item.price === 0 ? (
					<Text
						weight='2'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 4,
							fontSize: 17,
							lineHeight: '22px',
							marginBottom: 4,
							fontWeight: 700,
						}}
					>
						<span
							style={{
								background: 'linear-gradient(90deg, #16a34a 0%, #0ea5e9 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}
						>
							free
						</span>
					</Text>
				) : (
					<Text
						weight='2'
						style={{
							display: 'block',
							fontSize: 17,
							lineHeight: '22px',
							marginBottom: 4,
							color: 'var(--tgui--text_color)',
						}}
					>
						{formatPrice(item.price)}
					</Text>
				)}

				<Subheadline
					level='2'
					weight='3'
					style={{
						marginBottom: 4,
						minHeight: 36, // Фикс высоты под 2 строки
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						fontSize: 13,
						lineHeight: '18px',
					}}
				>
					{item.title}
				</Subheadline>

				<Caption
					level='1'
					weight='3'
					style={{
						color: 'var(--tgui--hint_color)',
						fontSize: 11,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{item.city}
				</Caption>
			</div>
		</Card>
	)
}

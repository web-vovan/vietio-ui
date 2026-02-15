import React from 'react'
import { PackageCheck, Calendar } from 'lucide-react'
import { Text } from '@telegram-apps/telegram-ui'
import { Ad } from '../types'
import { formatDate, formatPrice } from '../helpers/helper'

interface AdCardSoldProps {
	item: Ad
}

export const AdCardSold = ({ item }: AdCardSoldProps) => {
	return (
		<div
			style={{
				background: 'var(--tgui--bg_color)',
				borderRadius: 14,
				padding: 12,
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				marginBottom: 8,
			}}
		>
			<div
				style={{
					width: 48,
					height: 48,
					borderRadius: 10,
					background: 'rgba(52, 199, 89, 0.1)', // Светло-зеленый фон
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				<PackageCheck size={24} color='var(--tgui--green)' />
			</div>

			<div style={{ flex: 1, overflow: 'hidden' }}>
				<div
					style={{
						fontWeight: 600,
						fontSize: 15,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						marginBottom: 2,
					}}
				>
					{item.title}
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<Calendar size={12} color='var(--tgui--hint_color)' />
					<Text style={{ fontSize: 13, color: 'var(--tgui--hint_color)' }}>
						{formatDate(item.created_at)}
					</Text>
				</div>
			</div>

			<div style={{ textAlign: 'right' }}>
				<div
					style={{ fontWeight: 600, fontSize: 15, color: 'var(--tgui--green)' }}
				>
					{formatPrice(item.price)}
				</div>
			</div>
		</div>
	)
}

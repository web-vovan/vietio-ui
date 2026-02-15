import React from 'react'
import { PiggyBank } from 'lucide-react'
import { Text } from '@telegram-apps/telegram-ui'

export const EmptyHistory = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '40px 20px',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					width: 80,
					height: 80,
					borderRadius: '50%',
					background: 'var(--tgui--secondary_bg_color)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 20,
				}}
			>
				<PiggyBank size={40} color='var(--tgui--link_color)' />
			</div>

			<Text weight='2' style={{ fontSize: 20, marginBottom: 8 }}>
				Пока продаж не было
			</Text>

			<Text
				style={{
					fontSize: 16,
					color: 'var(--tgui--hint_color)',
					maxWidth: 280,
					lineHeight: '1.4',
				}}
			>
				Здесь будет история ваших успехов
			</Text>
		</div>
	)
}

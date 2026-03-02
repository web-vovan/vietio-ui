import React from 'react'
import { Heart } from 'lucide-react'
import { Text } from '@telegram-apps/telegram-ui'

export const EmptyFavorites = () => {
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
			<div style={{ marginBottom: 16 }}>
				<Heart size={48} color='var(--tgui--hint_color)' />
			</div>

			<Text
				weight='2'
				style={{
					fontSize: 18,
					marginBottom: 8,
					color: 'var(--tgui--hint_color)',
				}}
			>
				В избранном пока пусто
			</Text>
		</div>
	)
}

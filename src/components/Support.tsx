import React from 'react'
import { Button, Text } from '@telegram-apps/telegram-ui'
import { LifeBuoy } from 'lucide-react'

export const Support = () => {
	const handleSupportClick = () => {
		const url = 'https://t.me/web_vovan'
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.openTelegramLink(url)
		} else {
			window.open(url, '_blank')
		}
	}

	return (
		<div
			style={{
				margin: '0 16px 16px 16px',
				padding: '16px',
				borderRadius: 16,
				background: 'var(--tgui--secondary_bg_color)',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 12,
			}}
		>
			<div
				style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					<LifeBuoy size={20} color='var(--tgui--link_color)' />
					<Text weight='2' style={{ fontSize: 16 }}>
						Поддержка
					</Text>
				</div>

				<Text
					style={{
						color: 'var(--tgui--hint_color)',
						fontSize: 13,
						lineHeight: '16px',
					}}
				>
					Поможем с любым вопросом
				</Text>
			</div>

			<Button
				size='s'
				mode='bezeled'
				onClick={handleSupportClick}
			>
				Написать
			</Button>
		</div>
	)
}

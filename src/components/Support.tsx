import React from 'react'
import { Cell, Button } from '@telegram-apps/telegram-ui'
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
				marginTop: '12px',
			}}
		>
			<Cell
				before={<LifeBuoy size={24} color='var(--tgui--link_color)' />}
				after={
					<Button size='s' mode='bezeled' onClick={handleSupportClick}>
						Написать
					</Button>
				}
			>
				Поддержка
			</Cell>
		</div>
	)
}

import React from 'react'
import { Info } from 'lucide-react'
import { Text } from '@telegram-apps/telegram-ui'

export const AdRulesInfo = () => {
	const user = window.Telegram?.WebApp?.initDataUnsafe?.user
	const hasUsername = Boolean(user?.username)

	return (
		<div style={{ padding: '0 16px', marginTop: 24, marginBottom: 12 }}>
			{!hasUsername && (
				<div
					style={{
						background: 'rgba(255, 59, 48, 0.1)',
						borderRadius: 12,
						padding: 12,
						marginBottom: 20,
						display: 'flex',
						gap: 12,
						alignItems: 'start',
					}}
				>
					<Info
						size={20}
						color='var(--tgui--destructive_text_color)'
						style={{ marginTop: 2, flexShrink: 0 }}
					/>
					<div>
						<Text
							weight='2'
							style={{
								color: 'var(--tgui--destructive_text_color)',
								fontSize: 14,
								display: 'block',
								marginBottom: 2,
							}}
						>
							Нет имени пользователя
						</Text>
						<Text
							style={{
								fontSize: 13,
								color: 'var(--tgui--destructive_text_color)',
								lineHeight: '1.4',
							}}
						>
							Покупатели не смогут вам написать. Пожалуйста, укажите @username в
							настройках Telegram.
						</Text>
					</div>
				</div>
			)}

			<div
				style={{
					margin: '0 auto', 
					textAlign: 'center',
				}}
			>
				<Text
					style={{
						fontSize: 13,
						color: 'var(--tgui--hint_color)',
						lineHeight: '1.5',
					}}
				>
					Объявление публикуется на <b>30 дней</b>.
					<br />
					Убедитесь, что настройки приватности Telegram позволяют присылать вам
					сообщения.
				</Text>
			</div>
		</div>
	)
}

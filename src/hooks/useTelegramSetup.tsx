import { useEffect } from 'react'

/**
 * Хук для базовой настройки Telegram WebApp
 */
export const useTelegramSetup = () => {
	useEffect(() => {
		const tg = window.Telegram?.WebApp
		if (!tg) return

		tg.ready()
		tg.expand()

		// @ts-expect-error Telegram API method may be missing in types
		tg.disableVerticalSwipes?.()

		tg.enableClosingConfirmation?.()
	}, [])
}

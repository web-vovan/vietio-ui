import { useEffect } from 'react'

/**
 * Хук для базовой настройки Telegram WebApp
 */
export const useTelegramSetup = () => {
	useEffect(() => {
		const tg = window.Telegram?.WebApp
		if (!tg) return
		
		// FALLBACK для старых версий (или если метод недоступен)
		// Если мы не можем отключить свайп, мы хотя бы включим подтверждение закрытия,
		// чтобы пользователь случайно не закрыл форму.
		if (typeof tg.enableClosingConfirmation === 'function') {
			tg.enableClosingConfirmation()
		}
	}, [])
}

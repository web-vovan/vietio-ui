import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const useIOSSwipeBack = () => {
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		// Проверяем, что это iOS (опционально, можно оставить для всех)
		const isIOS =
			/iPad|iPhone|iPod/.test(navigator.userAgent)

		if (!isIOS) return

		let touchStartX = 0
		let touchStartY = 0

		const handleTouchStart = (e: TouchEvent) => {
			// Запоминаем начало касания
			touchStartX = e.changedTouches[0].screenX
			touchStartY = e.changedTouches[0].screenY
		}

		const handleTouchEnd = (e: TouchEvent) => {
			const touchEndX = e.changedTouches[0].screenX
			const touchEndY = e.changedTouches[0].screenY

			// 1. Свайп должен начинаться от самого левого края (зона 50px)
			if (touchStartX > 50) return

			// 2. Вычисляем разницу
			const diffX = touchEndX - touchStartX
			const diffY = Math.abs(touchEndY - touchStartY)

			// 3. Условия успешного свайпа:
			// - Движение вправо больше 50px
			// - Движение по горизонтали сильно больше, чем по вертикали (чтобы не путать со скроллом)
			if (diffX > 50 && diffX > diffY * 3) {
				// Если мы не на главной, идем назад
				if (location.pathname !== '/') {
					navigate(-1)
				}
			}
		}

		// Добавляем слушатели на window
		window.addEventListener('touchstart', handleTouchStart, { passive: true })
		window.addEventListener('touchend', handleTouchEnd, { passive: true })

		return () => {
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchend', handleTouchEnd)
		}
	}, [location, navigate])
}

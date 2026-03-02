import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useTelegramBackButton = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const tg = window.Telegram?.WebApp
		if (!tg) return

		const isRoot = location.pathname === '/'

		if (isRoot) {
			tg.BackButton.hide()
		} else {
			tg.BackButton.show()
		}

		const handleClick = () => {
			const canGoBack = window.history.state && window.history.state.idx > 0

			if (canGoBack) {
				navigate(-1)
			} else {
				navigate('/', { replace: true })
			}
		}

		tg.BackButton.onClick(handleClick)

		return () => {
			tg.BackButton.offClick(handleClick)
		}
	}, [location, navigate])
}

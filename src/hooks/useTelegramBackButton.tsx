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
			if (window.history.length > 1) {
				navigate(-1)
			} else {
				tg.close()
			}
		}

		tg.BackButton.onClick(handleClick)

		return () => {
			tg.BackButton.offClick(handleClick)
		}
	}, [location, navigate])
}

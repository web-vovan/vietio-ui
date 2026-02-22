import React, { useEffect } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

// Импорт страниц
import { FeedPage } from './pages/FeedPage'
import { CreateAdPage } from './pages/CreateAdPage'
import { AdDetailsPage } from './pages/AdDetailsPage'
import { EditAdPage } from './pages/EditAdPage'
import { ProfilePage } from './pages/ProfilePage'
import { SnackbarProvider } from './providers/SnackbarProvider'

const DeepLinkHandler = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const tg = window.Telegram?.WebApp

		if (tg?.initDataUnsafe?.start_param) {
			const startParam = tg.initDataUnsafe.start_param
			navigate(`/ads/${startParam}`)
		}
	}, [navigate])

	return null
}

export const App = () => (
	<AppRoot>
		<BrowserRouter>
			<SnackbarProvider>
				<DeepLinkHandler />

				<Routes>
					{/* Главная */}
					<Route path='/' element={<FeedPage />} />

					{/* Страница создания */}
					<Route path='/create' element={<CreateAdPage />} />

					{/* Страница редактирования */}
					<Route path='/ads/:uuid/edit' element={<EditAdPage />} />

					{/* Детальная страница */}
					<Route path='/ads/:uuid' element={<AdDetailsPage />} />

					{/* Профиль */}
					<Route path='/profile' element={<ProfilePage />} />
				</Routes>
			</SnackbarProvider>
		</BrowserRouter>
	</AppRoot>
)

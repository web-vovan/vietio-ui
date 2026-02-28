import React, { PropsWithChildren, useEffect, useRef } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
// 1. Импортируем QueryClient и провайдер
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { FeedPage } from './pages/FeedPage'
import { CreateAdPage } from './pages/CreateAdPage'
import { AdDetailsPage } from './pages/AdDetailsPage'
import { EditAdPage } from './pages/EditAdPage'
import { ProfilePage } from './pages/ProfilePage'
import { SnackbarProvider } from './providers/SnackbarProvider'
import { useTelegramBackButton } from './hooks/useTelegramBackButton'
// import { useIOSSwipeBack } from './hooks/useIOSSwipeBack'
import { useTelegramSetup } from './hooks/useTelegramSetup'

// 2. Создаем клиент (желательно вне компонента App, чтобы он не пересоздавался при рендере)
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Важно для вашего UX: данные считаются свежими 5 минут.
			// При возврате назад страница покажет кэш и НЕ будет дергать сервер.
			staleTime: 5 * 60 * 1000,
			// Не перезапрашивать данные, если пользователь свернул/развернул телеграм
			refetchOnWindowFocus: false,
			// Количество попыток при ошибке (можно поставить 1 или 2)
			retry: 1,
		},
	},
})

const DeepLinkHandler = () => {
	const navigate = useNavigate()
	const handledRef = useRef(false)

	useEffect(() => {
		if (handledRef.current) return

		const tg = window.Telegram?.WebApp

		if (tg?.initDataUnsafe?.start_param) {
			const startParam = tg.initDataUnsafe.start_param

			if (startParam) {
				handledRef.current = true

				navigate('/', { replace: true })
				setTimeout(() => {
					navigate(`/ads/${startParam}`)
				}, 0)
			}
		}
	}, [navigate])

	return null
}

export const TelegramNavigation = ({ children }: PropsWithChildren) => {
	useTelegramSetup()
	useTelegramBackButton()
	// useIOSSwipeBack()
	return <>{children}</>
}

export const App = () => (
	<AppRoot>
		{/* 3. Оборачиваем все приложение в QueryClientProvider */}
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<SnackbarProvider>
					<TelegramNavigation>
						<DeepLinkHandler />

						<Routes>
							<Route path='/' element={<FeedPage />} />
							<Route path='/create' element={<CreateAdPage />} />
							<Route path='/ads/:uuid/edit' element={<EditAdPage />} />
							<Route path='/ads/:uuid' element={<AdDetailsPage />} />
							<Route path='/profile' element={<ProfilePage />} />
						</Routes>
					</TelegramNavigation>
				</SnackbarProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</AppRoot>
)

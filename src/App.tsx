import React, { PropsWithChildren, useEffect, useState, useRef } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { FeedPage } from './pages/FeedPage'
import { CreateAdPage } from './pages/CreateAdPage'
import { AdDetailsPage } from './pages/AdDetailsPage'
import { EditAdPage } from './pages/EditAdPage'
import { ProfilePage } from './pages/ProfilePage'
import { SnackbarProvider } from './providers/SnackbarProvider'
import { useTelegramBackButton } from './hooks/useTelegramBackButton'
import { useIOSSwipeBack } from './hooks/useIOSSwipeBack'
import { useTelegramSetup } from './hooks/useTelegramSetup'

// Настройка клиента
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
})

// Хелперы для навигации и Telegram
export const TelegramNavigation = ({ children }: PropsWithChildren) => {
	useTelegramSetup()
	useTelegramBackButton()
	useIOSSwipeBack()
	return <>{children}</>
}

const DeepLinkController = ({ children }: PropsWithChildren) => {
	const navigate = useNavigate()
	const location = useLocation() // <--- 1. Добавляем хук location
	const [isReady, setIsReady] = useState(false)
	const checkedRef = useRef(false)

	const UUID_REGEX =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

	useEffect(() => {
		// Если мы уже все решили и отрисовали приложение, ничего не делаем
		if (isReady) return

		// Логика проверки выполняется только один раз при старте
		if (!checkedRef.current) {
			checkedRef.current = true

			const tg = window.Telegram?.WebApp
			const startParam = tg?.initDataUnsafe?.start_param

			if (
				startParam &&
				typeof startParam === 'string' &&
				UUID_REGEX.test(startParam)
			) {
				// Если есть параметр, навигируем
				navigate(`/ads/${startParam}`, { replace: true })

				// 2. ВАЖНО: Мы делаем return и НЕ ставим setIsReady(true) прямо сейчас.
				// Мы ждем, пока Router обновит location, что вызовет перезапуск этого эффекта.
				return
			}
		}

		// 3. Этот код выполнится в двух случаях:
		// А) startParam не было вообще (сразу идем сюда).
		// Б) startParam был, navigate сработал, location обновился, эффект перезапустился,
		//    checkedRef уже true, поэтому блок if выше пропускается, и мы попадаем сюда.

		setIsReady(true)
	}, [navigate, location, isReady]) // <--- 4. location в зависимостях

	if (!isReady) {
		return null
	}

	return <>{children}</>
}

export const App = () => (
	<AppRoot>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<SnackbarProvider>
					<TelegramNavigation>
						<DeepLinkController>
							<Routes>
								<Route path='/' element={<FeedPage />} />
								<Route path='/create' element={<CreateAdPage />} />
								<Route path='/ads/:uuid/edit' element={<EditAdPage />} />
								<Route path='/ads/:uuid' element={<AdDetailsPage />} />
								<Route path='/profile' element={<ProfilePage />} />
							</Routes>
						</DeepLinkController>
					</TelegramNavigation>
				</SnackbarProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</AppRoot>
)

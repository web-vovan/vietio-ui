import React from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Импорт страниц
import { FeedPage } from './pages/FeedPage'
import { CreateAdPage } from './pages/CreateAdPage'
import { AdDetailsPage } from './pages/AdDetailsPage'

export const App = () => (
	<AppRoot>
		{/* Оборачиваем все в BrowserRouter */}
		<BrowserRouter>
			<Routes>
				{/* Главная страница (Лента) */}
				<Route path='/' element={<FeedPage />} />

				{/* Страница создания */}
				<Route path='/create' element={<CreateAdPage />} />

				{/* Детальная страница (id - динамический параметр) */}
				<Route path='/ad/:id' element={<AdDetailsPage />} />
			</Routes>
		</BrowserRouter>
	</AppRoot>
)

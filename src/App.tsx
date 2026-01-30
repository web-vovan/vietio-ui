import React from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Импорт страниц
import { FeedPage } from './pages/FeedPage'
import { CreateAdPage } from './pages/CreateAdPage'
import { AdDetailsPage } from './pages/AdDetailsPage'
import { EditAdPage } from './pages/EditAdPage'

export const App = () => (
	<AppRoot>
		<BrowserRouter>
			<Routes>
				{/* Главная */}
				<Route path='/' element={<FeedPage />} />

				{/* Страница создания */}
				<Route path='/create' element={<CreateAdPage />} />

				{/* Страница редактирования */}
				<Route path='/ads/:uuid/edit' element={<EditAdPage />} />

				{/* Детальная страница */}
				<Route path='/ads/:uuid' element={<AdDetailsPage />} />
			</Routes>
		</BrowserRouter>
	</AppRoot>
)

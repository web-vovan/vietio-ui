import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	AppRoot,
	Button,
	Spinner,
	Placeholder,
} from '@telegram-apps/telegram-ui'

import { ImageGallery } from '../components/ImageGallery'
import { AdDetailHeader } from '../components/AdDetailHeader'
import { MessageButton } from '../components/MessageButton'
import { AdDetailInfo } from '../components/AdDetailInfo'
import { AdDetail } from '../types'

// --- ФЕЙКОВЫЕ ДАННЫЕ ---
const FAKE_AD: AdDetail = {
	id: 1,
	title: 'MacBook Pro 14 M1 Pro 16/512GB Space Gray',
	price: 32500000,
	currency: 'VND',
	city: 'Нячанг',
	// Специально добавляю переносы строк (\n), чтобы проверить форматирование
	description:
		'Продаю верного друга. Состояние идеальное, ни царапины. Использовался только дома в чехле.\n\nХарактеристики:\n- Процессор: M1 Pro\n- Память: 16 ГБ\n- SSD: 512 ГБ\n\nПолный комплект: зарядка, коробка, чек. Батарея 94% (120 циклов).\n\nПричина продажи: перехожу на M3. Любые проверки при встрече. Торг минимальный.',
	// Реальные картинки с Unsplash для красоты
	photos: [
		'https://www.laptopvip.vn/images/ab__webp/detailed/16/macbook-air-13-inch-mmgg2-core-i5-5250u-4-www.laptopvip.vn-1472027960.webp',
		'https://laptoptrieuphat.com/wp-content/uploads/2021/12/macbook-air-M1-6.jpg',
		'https://maconline.vn/uploads/macbook/macbook-pro/0-2023-macbook-pro-14inch/macbook-pro-14-inch-m2-pro.jpg',
	],
	created_at: new Date().toISOString(),
}

export const AdDetailsPage = () => {
	const { id } = useParams() // Получаем ID из URL (/ad/123)
	const navigate = useNavigate()

	const [ad, setAd] = useState<AdDetail | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)


	useEffect(() => {
		// Эмулируем задержку сети 500мс для реалистичности
		const timer = setTimeout(() => {
			// Просто подставляем фейковые данные
			setAd({
				...FAKE_AD,
				id: Number(id), // Подставляем ID из URL, чтобы казалось правдой
			})
			setIsLoading(false)
		}, 500)

		setError("")

		return () => clearTimeout(timer)
	}, [id])

	// useEffect(() => {
	// 	const fetchAdDetails = async () => {
	// 		try {
	// 			setIsLoading(true)
	// 			// Запрос к API по ID
	// 			const response = await fetch(`/api/ads/${id}`)

	// 			if (!response.ok) throw new Error('Объявление не найдено')

	// 			const data = await response.json()

	// 			// Адаптер данных (если бэк возвращает UpperCase, приводим к нашему виду)
	// 			// Если у вас json-server и вы сохраняли через CreateAdPage, поля уже правильные (lowercase)
	// 			// Но на всякий случай добавим проверку:
	// 			const adaptedAd: Ad = {
	// 				id: data.id || data.ID,
	// 				title: data.title || data.Title,
	// 				price: data.price || data.Price,
	// 				currency: 'VND',
	// 				city: data.city || 'Вьетнам',
	// 				description:
	// 					data.description || data.Description || 'Описание отсутствует',
	// 				// Если фото нет, пробуем взять image_url и положить в массив
	// 				photos: data.photos || (data.image_url ? [data.image_url] : []),
	// 				created_at:
	// 					data.createdAt || data.created_at || new Date().toISOString(),
	// 			}

	// 			setAd(adaptedAd)
	// 		} catch (err) {
	// 			console.error(err)
	// 			setError('Не удалось загрузить объявление')
	// 		} finally {
	// 			setIsLoading(false)
	// 		}
	// 	}

	// 	fetchAdDetails()
	// }, [id])

	// --- РЕНДЕР: ЗАГРУЗКА ---
	if (isLoading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Spinner size='l' />
			</div>
		)
	}

	if (error || !ad) {
		return (
			<Placeholder
				header='Ошибка'
				description={error || 'Объявление не найдено'}
			>
				<Button onClick={() => navigate('/')}>На главную</Button>
			</Placeholder>
		)
	}

	return (
		<AppRoot>
			<AdDetailHeader />

			<div style={{ paddingTop: 60, paddingBottom: 100 }}>
				<ImageGallery images={ad.photos || []} />

				<AdDetailInfo 
					title={ad.title}
					price={ad.price} 
					description={ad.description}
					date={ad.created_at}
					city={ad.city}
				/>
			</div>

			<MessageButton />
		</AppRoot>
	)
}

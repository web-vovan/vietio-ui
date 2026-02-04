import React, { useState, useEffect } from 'react'

import { EmptySearch } from '../components/EmptySearch'
import { ErrorSearch } from '../components/ErrorSearch'
import { MyAdsHeader } from '../components/MyAdsHeader'
import { AdCard } from '../components/AdCard'
import { Loader } from '../components/Loader'

import { Ad } from '../types'
import { apiClient } from '../api/apiClient'

export const MyAdsPage = () => {
	const [ads, setAds] = useState<Ad[]>([]) // Список объявлений
	const [totalCount, setTotalCount] = useState<number>(0) // Количество объявлений
	const [isLoading, setIsLoading] = useState(true) // Индикатор загрузки
	const [error, setError] = useState<string | null>(null) // Ошибки

	useEffect(() => {
		const fetchAds = async () => {
			try {
				setIsLoading(true)

				const response = await apiClient("/api/my")

				if (!response.ok) {
					throw new Error(`Ошибка: ${response.statusText}`)
				}

				const rawData = await response.json()

				const rawItems = rawData.items || []
				setTotalCount(rawData.total || 0)

				const adaptedAds: Ad[] = rawItems.map((item: any) => ({
					uuid: item.uuid,
					title: item.title,
					price: item.price,
					currency: 'VND',
					city: item.city,
					image: item.image,
					category_id: item.category_id
				}))

				setAds(adaptedAds)
			} catch (err: any) {
				console.error(err)
				setError('Не удалось загрузить объявления')
			} finally {
				setIsLoading(false)
			}
		}

		fetchAds()
	}, [])

	return (
		<>
			{/* --- ФИКСИРОВАННАЯ ШАПКА --- */}
			<MyAdsHeader />

			{/* --- ОСНОВНОЙ КОНТЕЙНЕР --- */}
			<div style={{ paddingTop: 70, paddingBottom: 40 }}>
				{/* Initial loading */}
				{isLoading && ads.length === 0 && <Loader size='l' />}

				{/* Ошибка загрузки */}
				{error && !isLoading && <ErrorSearch error={error} />}

				{/* Нет результатов */}
				{!isLoading && !error && totalCount === 0 && <EmptySearch />}

				{/* Данные загрузились */}
				{!error && ads.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 12,
							padding: '0 16px',
						}}
					>
						{ads.map((item) => {
							return (
								<div key={item.uuid}>
									<AdCard item={item} />
								</div>
							)
						})}
					</div>
				)}
			</div>
		</>
	)
}
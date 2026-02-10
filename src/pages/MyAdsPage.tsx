import React, { useState, useEffect } from 'react'

import { EmptySearch } from '../components/EmptySearch'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
import { MyAdsHeader } from '../components/MyAdsHeader'
import { AdCard } from '../components/AdCard'
import { Loader } from '../components/Loader'

import { Ad } from '../types'
import { apiClient } from '../api/apiClient'

export const MyAdsPage = () => {
	const [ads, setAds] = useState<Ad[]>([]) // Список объявлений
	const [totalCount, setTotalCount] = useState<number>(0) // Количество объявлений
	const [isLoading, setIsLoading] = useState(true) // Индикатор загрузки
	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	useEffect(() => {
		const fetchAds = async () => {
			try {
				setIsLoading(true)
				setErrorType(null)

				const response = await apiClient("/api/my")

				if (!response.ok) {
					throw new Error(`server error`)
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
				setErrorType('server_error')
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
				{errorType && !isLoading && (
					<ErrorPlaceholder showHeader={true} errorType={errorType || 'server_error'} />
				)}

				{/* Нет результатов */}
				{!isLoading && !errorType && totalCount === 0 && <EmptySearch />}

				{/* Данные загрузились */}
				{!errorType && ads.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 12,
							padding: '0 16px',
						}}
					>
						{ads.map(item => {
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
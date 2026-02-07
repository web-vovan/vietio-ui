import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { EmptySearch } from '../components/EmptySearch'
import { ErrorSearch } from '../components/ErrorSearch'
import { CategoriesBar } from '../components/CategoriesBar'
import { MainHeader } from '../components/MainHeader'
import { CounterAndSort } from '../components/CounterAndSort'
import { AdCard } from '../components/AdCard'
import { Loader } from '../components/Loader'
import { FabMenu } from '../components/FabMenu'

import { Ad } from '../types'
import { categories } from '../constants'
import { apiClient } from '../api/apiClient'

export const FeedPage = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const currentCategoryId = parseInt(searchParams.get('category_id') || '0')
	const currentSort = searchParams.get('sort') || 'date_desc'

	const [ads, setAds] = useState<Ad[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)

	// Рефы для хранения предыдущих фильтров (чтобы избежать двойных запросов)
	const prevCategoryId = useRef(currentCategoryId)
	const prevSort = useRef(currentSort)

	const observer = useRef<IntersectionObserver | null>(null)

	// --- Callback для бесконечного скролла ---
	const lastElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) return // Не триггерим, если уже грузим

			if (observer.current) observer.current.disconnect()

			observer.current = new IntersectionObserver(entries => {
				// Если якорь появился на экране и есть еще страницы
				if (entries[0].isIntersecting && hasMore) {
					setPage(prev => prev + 1)
				}
			})

			if (node) observer.current.observe(node)
		},
		[isLoading, hasMore],
	)

	const handleCategoryChange = (id: number) => {
		const newParams = new URLSearchParams(searchParams)
		if (id === 0) newParams.delete('category_id')
		else newParams.set('category_id', id.toString())
		setSearchParams(newParams)
	}

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newValue = e.target.value
		const newParams = new URLSearchParams(searchParams)
		newParams.set('sort', newValue)
		setSearchParams(newParams)
	}

	// --- ОСНОВНОЙ ЭФФЕКТ ЗАГРУЗКИ ---
	useEffect(() => {
		// 1. Проверяем смену фильтров
		const isFilterChanged =
			prevCategoryId.current !== currentCategoryId ||
			prevSort.current !== currentSort

		if (isFilterChanged) {
			prevCategoryId.current = currentCategoryId
			prevSort.current = currentSort

			// Если мы не на 1 странице, сбрасываем и прерываем текущий эффект
			if (page !== 1) {
				setPage(1)
				setAds([])
				return // Ждем перезапуска эффекта с page=1
			}

			// Если мы на 1 странице, просто чистим список перед загрузкой
			setAds([])
		}

		const fetchAds = async () => {
			try {
				setIsLoading(true)

				let url = '/api/ads'
				const params = [`page=${page}`]

				if (currentCategoryId > 0) {
					params.push(`category_id=${currentCategoryId}`)
				}

				if (currentSort) {
					params.push(`sort=${currentSort}`)
				}

				if (params.length > 0) {
					url += `?${params.join('&')}`
				}

				const response = await apiClient(url)

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
					category_id: item.category_id,
				}))

				setAds(prev => {
					// Если 1 страница - заменяем, иначе добавляем
					if (page === 1) return adaptedAds
					return [...prev, ...adaptedAds]
				})

				// Проверяем, есть ли еще данные
				const loadedCount = (page - 1) * 20 + adaptedAds.length
				setHasMore(loadedCount < rawData.total)
			} catch (err: any) {
				console.error(err)
				setError('Не удалось загрузить объявления')
			} finally {
				setIsLoading(false)
			}
		}

		fetchAds()
	}, [currentCategoryId, currentSort, page])

	return (
		<>
			<MainHeader />

			<div style={{ paddingTop: 70, paddingBottom: 40 }}>
				<CategoriesBar
					categories={categories}
					currentCategoryId={currentCategoryId}
					onCategoryChange={handleCategoryChange}
				/>

				<CounterAndSort
					isLoading={isLoading}
					totalCount={totalCount}
					currentSort={currentSort}
					error={error}
					handleSortChange={handleSortChange}
				/>

				{/* Лоадер при ПЕРВОЙ загрузке */}
				{isLoading && ads.length === 0 && <Loader size='l' />}

				{error && !isLoading && <ErrorSearch error={error} />}

				{!isLoading && !error && totalCount === 0 && <EmptySearch />}

				{/* СПИСОК ТОВАРОВ */}
				{!error && ads.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 12,
							padding: '0 16px',
						}}
					>
						{ads.map(item => (
							// ПРОСТО РЕНДЕРИМ, БЕЗ REF
							<AdCard key={item.uuid} item={item} />
						))}
					</div>
				)}

				{/* 
                    --- ЯКОРЬ БЕСКОНЕЧНОГО СКРОЛЛА ---
                    Этот блок виден только если есть данные и есть что еще грузить.
                    Observer следит за ним.
                */}
				{!isLoading && hasMore && ads.length > 0 && (
					<div
						ref={lastElementRef}
						style={{ height: 40, width: '100%', opacity: 0 }}
					/>
				)}

				{/* Лоадер при ПОДГРУЗКЕ (внизу) */}
				{isLoading && ads.length > 0 && <Loader size='s' />}
			</div>

			<FabMenu />
		</>
	)
}

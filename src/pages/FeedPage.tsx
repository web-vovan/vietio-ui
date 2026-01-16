import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { EmptySearch } from '../components/EmptySearch'
import { ErrorSearch } from '../components/ErrorSearch'
import { CategoriesBar } from '../components/CategoriesBar'
import { MainHeader } from '../components/MainHeader'
import { CounterAndSort } from '../components/CounterAndSort'
import { AdCard } from '../components/AdCard'
import { Loader } from '../components/Loader'

import { Ad } from '../types'

export const FeedPage = () => {
	// 1. Используем хук для управления URL параметрами
	const [searchParams, setSearchParams] = useSearchParams()
	// const navigate = useNavigate() // Для перехода на другие страницы

	// Читаем категорию из URL (или 'all')
	const currentCategoryId = parseInt(searchParams.get('category_id') || '0')

	// 1. Читаем сортировку из URL
	const currentSort = searchParams.get('sort') || 'date_desc'

	const [ads, setAds] = useState<Ad[]>([]) // Список объявлений
	const [totalCount, setTotalCount] = useState<number>(0) // Количество объявлений
	const [isLoading, setIsLoading] = useState(true) // Индикатор загрузки
	const [error, setError] = useState<string | null>(null) // Ошибки

	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)

	// const loaderRef = useRef<HTMLDivElement | null>(null)

	const observer = useRef<IntersectionObserver | null>(null)

	const lastElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) return

			if (observer.current) observer.current.disconnect()

			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasMore) {
					setPage(prev => prev + 1)
				}
			})

			if (node) observer.current.observe(node)
		},
		[isLoading, hasMore]
	)

	// Смена категории через хук роутера
	const handleCategoryChange = (id: number) => {
		setIsLoading(true) 

		// При смене категории сохраняем текущую сортировку!
		const newParams = new URLSearchParams(searchParams)

		if (id === 0) {
			newParams.delete('category_id')
		} else {
			newParams.set('category_id', id.toString())
		}
		setSearchParams(newParams)
	}

	// 2. Обработчик смены сортировки
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setIsLoading(true) 
		
		const newValue = e.target.value

		// Копируем текущие параметры (чтобы не сбросить выбранную категорию!)
		const newParams = new URLSearchParams(searchParams)

		// Обновляем только сортировку
		newParams.set('sort', newValue)

		setSearchParams(newParams)
	}

	useEffect(() => {
		setAds([])
		setPage(1)
		setHasMore(true)
		setError(null)
	}, [currentCategoryId, currentSort])

	useEffect(() => {
		const fetchAds = async () => {
			try {
				setIsLoading(true)

				let url = '/api/ads'
				const params = [`page=${page}`]

				if (currentCategoryId > 0) {
					params.push(`category_id=${currentCategoryId}`)
				}

				// 2. Сортировка (Добавлено)
				// Если currentSort существует (а он по умолчанию 'newest'), добавляем в запрос
				if (currentSort) {
					params.push(`sort=${currentSort}`)
				}

				// Склеиваем параметры через & (например: ?category_id=1&sort=price_asc)
				if (params.length > 0) {
					url += `?${params.join('&')}`
				}

				const response = await fetch(url)

				if (!response.ok) {
					throw new Error(`Ошибка: ${response.statusText}`)
				}

				// 1. Получаем "сырой" ответ
				const rawData = await response.json()

				// 2. Достаем массив из поля "items"
				// Если items нет, берем пустой массив []
				const rawItems = rawData.items || []
				setTotalCount(rawData.total || 0)

				// 3. ПРЕОБРАЗОВАНИЕ (Adapter)
				// Здесь мы мапим поля API в поля нашего приложения и ставим заглушки
				const adaptedAds: Ad[] = rawItems.map((item: any) => ({
					id: item.ID, // API (ID) -> Frontend (id)
					title: item.Title, // API (Title) -> Frontend (title)
					price: item.Price, // API (Price) -> Frontend (price)

					// --- ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ ---
					currency: 'VND', // Раз API не шлет валюту, хардкодим донги
					city: 'Вьетнам', // Заглушка, пока API не научится отдавать город
					image_url: '', // Пустая строка, компонент сам подставит букву

					// Можно даже сгенерировать случайный цвет для заглушки картинки,
					// если мы добавим поле color в интерфейс Ad, но пока оставим так.
				}))

				setAds(prev => [...prev, ...adaptedAds])

				// Есть ли ещё страницы
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
			{/* --- ФИКСИРОВАННАЯ ШАПКА --- */}
			<MainHeader />

			{/* --- ОСНОВНОЙ КОНТЕЙНЕР --- */}
			<div style={{ paddingTop: 70, paddingBottom: 40 }}>
				{/* --- ГОРИЗОНТАЛЬНЫЙ СПИСОК КАТЕГОРИЙ --- */}
				<CategoriesBar
					currentCategoryId={currentCategoryId}
					onCategoryChange={handleCategoryChange}
				/>

				{/* --- БЛОК СОРТИРОВКИ И СЧЕТЧИКА --- */}
				<CounterAndSort
					isLoading={isLoading}
					totalCount={totalCount}
					currentSort={currentSort}
					error={error}
					handleSortChange={handleSortChange}
				/>

				{/* Initial loading */}
				{isLoading && ads.length === 0 && <Loader size='l' />}

				{/* Ошибка загрузки */}
				{error && !isLoading && <ErrorSearch error={error} />}

				{/* Нет результатов */}
				{!isLoading && !error && totalCount === 0 && <EmptySearch />}

				{/* Данные загрузились */}
				{!error && ads.length > 0 && (
					<>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: 12,
								padding: '0 16px',
							}}
						>
							{ads.map((item, index) => {
								const isLast = index === ads.length - 1

								return (
									<div key={item.id} ref={isLast ? lastElementRef : null}>
										<AdCard item={item} />
									</div>
								)
							})}
						</div>
					</>
				)}

				{/* Loading next page */}
				{isLoading && ads.length > 0 && <Loader size='s' />}
			</div>
		</>
	)
}
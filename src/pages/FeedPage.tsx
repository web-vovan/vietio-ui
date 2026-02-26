import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useSnackbar } from '../providers/SnackbarProvider'
import { EmptySearch } from '../components/EmptySearch'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
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
	const { showSnackbar } = useSnackbar()

	const currentCategoryId = parseInt(searchParams.get('category_id') || '0')
	const currentSort = searchParams.get('sort') || 'date_desc'

	const [ads, setAds] = useState<Ad[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(true)

	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)

	const prevCategoryId = useRef(currentCategoryId)
	const prevSort = useRef(currentSort)

	const observer = useRef<IntersectionObserver | null>(null)

	const lastElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (errorType) return
			if (isLoading) return

			if (observer.current) observer.current.disconnect()

			observer.current = new IntersectionObserver(entries => {
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

	useEffect(() => {
		if (sessionStorage.getItem('adCreated') === 'true') {
			showSnackbar(
				'success',
				'Объявление опубликовано',
			)
			sessionStorage.removeItem('adCreated')
		}
		if (sessionStorage.getItem('adDeleted') === 'true') {
			showSnackbar(
				'success',
				'Объявление удалено',
			)
			sessionStorage.removeItem('adDeleted')
		}
		if (sessionStorage.getItem('adSold') === 'true') {
			showSnackbar('success', 'Статус изменен')
			sessionStorage.removeItem('adSold')
		}
	}, [])

	useEffect(() => {
		const isFilterChanged =
			prevCategoryId.current !== currentCategoryId ||
			prevSort.current !== currentSort

		if (isFilterChanged) {
			prevCategoryId.current = currentCategoryId
			prevSort.current = currentSort

			if (page !== 1) {
				setPage(1)
				setAds([])
				return
			}

			setAds([])
		}

		const fetchAds = async () => {
			try {
				setIsLoading(true)
				setErrorType(null)

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
					category_id: item.category_id,
				}))

				setAds(prev => {
					if (page === 1) return adaptedAds
					return [...prev, ...adaptedAds]
				})

				const loadedCount = (page - 1) * 20 + adaptedAds.length
				setHasMore(loadedCount < rawData.total)
			} catch (err: any) {
				setErrorType('server_error')
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

				{!errorType && (
					<CounterAndSort
						isLoading={isLoading}
						totalCount={totalCount}
						currentSort={currentSort}
						handleSortChange={handleSortChange}
					/>
				)}

				{isLoading && ads.length === 0 && <Loader size='l' />}

				{errorType && !isLoading && (
					<ErrorPlaceholder errorType={errorType || 'server_error'} />
				)}

				{!isLoading && !errorType && totalCount === 0 && <EmptySearch />}

				{!errorType && ads.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
							gap: 12,
							padding: '0 16px',
						}}
					>
						{ads.map(item => (
							<AdCard key={item.uuid} item={item} />
						))}
					</div>
				)}

				{!isLoading && hasMore && ads.length > 0 && (
					<div
						ref={lastElementRef}
						style={{ height: 40, width: '100%', opacity: 0 }}
					/>
				)}

				{isLoading && ads.length > 0 && <Loader size='s' />}
			</div>

			<FabMenu />
		</>
	)
}

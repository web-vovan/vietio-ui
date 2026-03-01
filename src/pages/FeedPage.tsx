import React, { useEffect } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { useSnackbar } from '../providers/SnackbarProvider'
import { EmptySearch } from '../components/EmptySearch'
import { ErrorPlaceholder } from '../components/ErrorPlaceholder'
import { CategoriesBar } from '../components/CategoriesBar'
import { MainHeader } from '../components/MainHeader'
import { CounterAndSort } from '../components/CounterAndSort'
import { AdCard } from '../components/AdCard'
import { Loader } from '../components/Loader'
import { FabMenu } from '../components/FabMenu'

import { Ad } from '../types'
import { categories } from '../constants'
import { apiClient } from '../api/apiClient'

const fetchAds = async ({ pageParam = 1, categoryId, sort }: any) => {
	let url = '/api/ads'
	const params = [`page=${pageParam}`]

	if (categoryId > 0) params.push(`category_id=${categoryId}`)
	if (sort) params.push(`sort=${sort}`)

	url += `?${params.join('&')}`

	const response = await apiClient(url)
	if (!response.ok) throw new Error('server error')

	return response.json()
}

export const FeedPage = () => {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()
	const { showSnackbar } = useSnackbar()

	const currentCategoryId = parseInt(searchParams.get('category_id') || '0')
	const currentSort = searchParams.get('sort') || 'date_desc'

	const { ref, inView } = useInView({ rootMargin: '400px' })

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery({
		queryKey: ['ads', currentCategoryId, currentSort],
		queryFn: ({ pageParam }) =>
			fetchAds({ pageParam, categoryId: currentCategoryId, sort: currentSort }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const loadedCount = (allPages.length - 1) * 20 + lastPage.items.length

			return loadedCount < lastPage.total ? allPages.length + 1 : undefined
		},
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 10,
	})

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

	const allAds: Ad[] =
		data?.pages.flatMap(page =>
			page.items.map((item: any) => ({
				uuid: item.uuid,
				title: item.title,
				price: item.price,
				currency: 'VND',
				city: item.city,
				image: item.image,
				category_id: item.category_id,
			})),
		) || []

	/* =========================
	   ВОССТАНОВЛЕНИЕ SCROLL
	========================= */

	useEffect(() => {
		const raw = sessionStorage.getItem('feed_scroll')
		if (!raw) return

		const saved = JSON.parse(raw)

		const currentPath = location.pathname + location.search

		// Восстанавливаем ТОЛЬКО если вернулись туда же
		if (saved.path === currentPath && allAds.length > 0) {
			// Восстанавливаем скролл контейнер
			requestAnimationFrame(() => {
				window.scrollTo(0, saved.scrollY)
			})
		}
	}, [allAds.length, location.pathname, location.search])

	/* ========================= */

	useEffect(() => {
		if (sessionStorage.getItem('adCreated') === 'true') {
			showSnackbar('success', 'Объявление опубликовано')
			sessionStorage.removeItem('adCreated')
		}
	}, [])

	const handleCategoryChange = (id: number) => {
		const newParams = new URLSearchParams(searchParams)
		if (id === 0) newParams.delete('category_id')
		else newParams.set('category_id', id.toString())

		setSearchParams(newParams)

		sessionStorage.removeItem('feed_scroll')

		// Смена фильтра → всегда вверх
		window.scrollTo(0, 0)
	}

	const handleAdClick = (item: Ad) => {
		sessionStorage.setItem(
			'feed_scroll',
			JSON.stringify({
				scrollY: window.scrollY,
				path: location.pathname + location.search,
			}),
		)

		navigate(`/ads/${item.uuid}`)
	}

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('sort', e.target.value)

		sessionStorage.removeItem('feed_scroll')
		setSearchParams(newParams)
	}

	const totalCount = data?.pages[0]?.total || 0

	return (
		<>
			<MainHeader />

			<div style={{ paddingTop: 70, paddingBottom: 40 }}>
				<CategoriesBar
					categories={categories}
					currentCategoryId={currentCategoryId}
					onCategoryChange={handleCategoryChange}
				/>

				{!isError && (
					<CounterAndSort
						isLoading={isLoading}
						totalCount={totalCount}
						currentSort={currentSort}
						handleSortChange={handleSortChange}
					/>
				)}

				{isLoading && <Loader size='l' />}

				{isError && !isLoading && <ErrorPlaceholder errorType='server_error' />}

				{!isLoading && !isError && totalCount === 0 && <EmptySearch />}

				{!isError && allAds.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
							gap: 12,
							padding: '0 16px',
						}}
					>
						{allAds.map(item => (
							<AdCard key={item.uuid} item={item} onClick={handleAdClick} />
						))}
					</div>
				)}

				{isFetchingNextPage && (
					<div
						style={{
							padding: '20px 0',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Loader size='s' />
					</div>
				)}

				{!isFetchingNextPage && hasNextPage && (
					<div ref={ref} style={{ height: 20 }} />
				)}

				<div style={{ height: 60 }} />
			</div>

			<FabMenu showProfileBtn={true} useAnimation={true} />
		</>
	)
}

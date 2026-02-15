import React, { useState, useEffect } from 'react'

import { EmptySearch } from '../components/EmptySearch'
import { useSnackbar } from '../providers/SnackbarProvider'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
import { ProfileHeader } from '../components/ProfileHeader'
import { Support } from '../components/Support'
import { AdCard } from '../components/AdCard'
import { Loader } from '../components/Loader'
import { Text } from '@telegram-apps/telegram-ui'

import { Ad } from '../types'
import { apiClient } from '../api/apiClient'

export const ProfilePage = () => {
	const { showSnackbar } = useSnackbar()

	const [ads, setAds] = useState<Ad[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(true)
	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	useEffect(() => {
		if (sessionStorage.getItem('adDeleted') === 'true') {
			showSnackbar(
				'success',
				'Объявление удалено',
			)
			sessionStorage.removeItem('adDeleted')
		}
		if (sessionStorage.getItem('adCreated') === 'true') {
			showSnackbar('success', 'Объявление опубликовано')
			sessionStorage.removeItem('adCreated')
		}
	}, [])

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
			<ProfileHeader />

			<div
				style={{
					paddingTop: 90,
					paddingBottom: 40,
				}}
			>
				<Support />

				<div style={{ padding: '0 16px', marginTop: 24, marginBottom: 12 }}>
					<Text weight='2' style={{ fontSize: 20 }}>
						Мои объявления{' '}
						{totalCount > 0 && (
							<span style={{ color: 'var(--tgui--hint_color)', marginLeft: 6 }}>
								{totalCount}
							</span>
						)}
					</Text>
				</div>

				{isLoading && ads.length === 0 && <Loader size='l' />}

				{errorType && !isLoading && (
					<ErrorPlaceholder errorType={errorType || 'server_error'} />
				)}

				{/* Нет результатов */}
				{!isLoading && !errorType && totalCount === 0 && <EmptySearch />}

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
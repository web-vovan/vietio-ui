import React, { useState, useEffect } from 'react'
import { SegmentedControl, Text } from '@telegram-apps/telegram-ui' // Добавили SegmentedControl

import { EmptySearch } from '../components/EmptySearch'
import { useSnackbar } from '../providers/SnackbarProvider'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
import { ProfileHeader } from '../components/ProfileHeader'
import { Support } from '../components/Support'
import { AdCard } from '../components/AdCard'
import { AdCardSold } from '../components/AdCardSold' // Импорт новой карточки
import { Loader } from '../components/Loader'

import { Ad } from '../types'
import { apiClient } from '../api/apiClient'
import { EmptyHistory } from '../components/EmptyHistory'

type TabType = 'active' | 'sold'

export const ProfilePage = () => {
	const { showSnackbar } = useSnackbar()

	const [activeTab, setActiveTab] = useState<TabType>('active')

	const [ads, setAds] = useState<Ad[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(true)
	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	useEffect(() => {
		if (sessionStorage.getItem('adDeleted') === 'true') {
			showSnackbar('success', 'Объявление удалено')
			sessionStorage.removeItem('adDeleted')
		}
		if (sessionStorage.getItem('adCreated') === 'true') {
			showSnackbar('success', 'Объявление опубликовано')
			sessionStorage.removeItem('adCreated')
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const fetchAds = async () => {
			try {
				setIsLoading(true)
				setErrorType(null)
				setTotalCount(0)
				setAds([])

				const endpoint = activeTab === 'active' ? '/api/my' : '/api/my/sold'

				const response = await apiClient(endpoint)

				if (!response.ok) throw new Error(`server error`)

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
					created_at: item.created_at,
				}))

				setAds(adaptedAds)
			} catch (err: any) {
				setErrorType('server_error')
			} finally {
				setIsLoading(false)
			}
		}

		fetchAds()
	}, [activeTab])

	return (
		<>
			<ProfileHeader />

			<div
				style={{
					paddingTop: 'calc(60px + env(safe-area-inset-top))',
					backgroundColor: 'var(--tgui--secondary_bg_color)',
					paddingBottom: 40,
					minHeight: 'calc(100vh - 60px)',
				}}
			>
				<Support />

				<div style={{ margin: '20px 16px 20px 16px' }}>
					<SegmentedControl>
						<SegmentedControl.Item
							selected={activeTab === 'active'}
							onClick={() => setActiveTab('active')}
						>
							Активные
						</SegmentedControl.Item>
						<SegmentedControl.Item
							selected={activeTab === 'sold'}
							onClick={() => setActiveTab('sold')}
						>
							Продано
						</SegmentedControl.Item>
					</SegmentedControl>
				</div>

				<div style={{ padding: '0 16px', marginBottom: 12 }}>
					<Text weight='2' style={{ fontSize: 20 }}>
						{activeTab === 'active' ? 'Мои объявления' : 'История продаж'}
						{totalCount > 0 && (
							<span style={{ color: 'var(--tgui--hint_color)', marginLeft: 6 }}>
								{totalCount}
							</span>
						)}
					</Text>
				</div>

				{isLoading && <Loader size='l' />}

				{errorType && !isLoading && (
					<ErrorPlaceholder errorType={errorType || 'server_error'} />
				)}

				{!isLoading && !errorType && totalCount === 0 && (
					<div style={{ marginTop: 20 }}>
						{activeTab === 'active' ? <EmptySearch /> : <EmptyHistory />}
					</div>
				)}

				{!isLoading && !errorType && ads.length > 0 && (
					<div style={{ padding: '0 16px' }}>
						{activeTab === 'active' && (
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: '1fr 1fr',
									gap: 12,
								}}
							>
								{ads.map(item => (
									<div key={item.uuid}>
										<AdCard item={item} />
									</div>
								))}
							</div>
						)}

						{activeTab === 'sold' && (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								{ads.map(item => (
									<AdCardSold key={item.uuid} item={item} />
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</>
	)
}

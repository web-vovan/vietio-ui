import React, { useState, useEffect } from 'react'
import { Caption, SegmentedControl, Text } from '@telegram-apps/telegram-ui'

import { EmptySearch } from '../components/EmptySearch'
import { useSnackbar } from '../providers/SnackbarProvider'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
import { ProfileHeader } from '../components/ProfileHeader'
import { Support } from '../components/Support'
import { AdCard } from '../components/AdCard'
import { AdCardSold } from '../components/AdCardSold'
import { Loader } from '../components/Loader'

import { Ad } from '../types'
import { apiClient } from '../api/apiClient'
import { EmptyHistory } from '../components/EmptyHistory'
import { FabMenu } from '../components/FabMenu'
import { Archive, Grid, Heart, X } from 'lucide-react'
import { EmptyFavorites } from '../components/EmptyFavorites'

type TabType = 'active' | 'sold' | 'favorites'

export const ProfilePage = () => {
	const { showSnackbar } = useSnackbar()

	const [activeTab, setActiveTab] = useState<TabType>('active')

	const [ads, setAds] = useState<Ad[]>([])
	const [totalCount, setTotalCount] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(true)
	const [errorType, setErrorType] = useState<ErrorType | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

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

				let endpoint = '/api/my'
				if (activeTab === 'sold') endpoint = '/api/my/sold'
				if (activeTab === 'favorites') endpoint = '/api/my/favorites'

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
					status: item.status,
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
	}, [activeTab, refreshKey])

	const handleRemoveFromFavorites = async (uuid: string) => {
		try {
			const response = await apiClient(`/api/ads/${uuid}/favorite`, {
				method: 'DELETE',
			})

			if (!response.ok) throw new Error()

			setRefreshKey(prev => prev + 1) 

			showSnackbar(
				'success',
				'Удалено из избранного',
			)
		} catch {
			showSnackbar('error', 'Ошибка', 'Не удалось обновить избранное')
		} finally {
		}
	}

	const getTitle = () => {
		switch (activeTab) {
			case 'favorites':
				return 'Избранное'
			case 'sold':
				return 'История продаж'
			default:
				return 'Мои объявления'
		}
	}

	const getColorIcon = (isActive: boolean) => {
		return isActive ? 'var(--tgui--link_color)' : 'var(--tgui--hint_color)'
	}

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
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 6,
								}}
							>
								<Grid size={18} color={getColorIcon(activeTab === 'active')} />
							</div>
						</SegmentedControl.Item>

						<SegmentedControl.Item
							selected={activeTab === 'favorites'}
							onClick={() => setActiveTab('favorites')}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 6,
								}}
							>
								<Heart
									size={18}
									color={getColorIcon(activeTab === 'favorites')}
								/>
							</div>
						</SegmentedControl.Item>

						<SegmentedControl.Item
							selected={activeTab === 'sold'}
							onClick={() => setActiveTab('sold')}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 6,
								}}
							>
								<Archive size={18} color={getColorIcon(activeTab === 'sold')} />
							</div>
						</SegmentedControl.Item>
					</SegmentedControl>
				</div>

				<div style={{ padding: '0 16px', marginBottom: 12 }}>
					<Text weight='2' style={{ fontSize: 20 }}>
						{getTitle()}
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
						{activeTab === 'active' && <EmptySearch />}
						{activeTab === 'sold' && <EmptyHistory />}
						{activeTab === 'favorites' && <EmptyFavorites />}
					</div>
				)}

				{!isLoading && !errorType && ads.length > 0 && (
					<div style={{ padding: '0 16px' }}>
						{(activeTab === 'active' || activeTab === 'favorites') && (
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
									gap: 12,
								}}
							>
								{ads.map(item => {
									const isInactive = item.status !== 'active'

									return (
										<div key={item.uuid} style={{ position: 'relative' }}>
											<div style={{ opacity: isInactive ? 0.6 : 1 }}>
												<AdCard
													item={item}
													onClick={isInactive ? () => {} : undefined}
												/>
											</div>

											{item.status === 'sold' && (
												<Caption
													style={{
														position: 'absolute',
														top: 10,
														left: 10,
														background: 'rgba(0,0,0,0.6)',
														color: 'white',
														padding: '4px 8px',
														borderRadius: 8,
														fontSize: 12,
														fontWeight: 600,
														pointerEvents: 'none', // Чтобы клики проходили сквозь
													}}
												>
													Продано
												</Caption>
											)}

											{/* Кнопка быстрого удаления из избранного (обязательна для неактивных!) */}
											{activeTab === 'favorites' && (
												<div
													onClick={e => {
														e.stopPropagation()
														handleRemoveFromFavorites(item.uuid)
													}}
													style={{
														position: 'absolute',
														top: 8,
														right: 8,
														background: 'var(--tgui--bg_color)',
														borderRadius: '50%',
														width: 28,
														height: 28,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
														cursor: 'pointer',
														zIndex: 10,
													}}
												>
													{/* Импортировать иконку Trash или X из lucide-react */}
													<X
														size={16}
														color='var(--tgui--destructive_text_color)'
													/>
												</div>
											)}
										</div>
									)
								})}
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

				<FabMenu showProfileBtn={false} useAnimation={false} />
			</div>
		</>
	)
}

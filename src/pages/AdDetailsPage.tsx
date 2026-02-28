import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from '../providers/SnackbarProvider'
import {
	Button,
	FixedLayout,
	Modal,
	Text,
} from '@telegram-apps/telegram-ui'

import { ImageGallery } from '../components/ImageGallery'
import { AdDetailHeader } from '../components/AdDetailHeader'
import { MessageButton } from '../components/MessageButton'
import { AdDetailInfo } from '../components/AdDetailInfo'
import { AdDetailLoader } from '../components/AdDetailLoader'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
import { AdDetail } from '../types'
import { apiClient } from '../api/apiClient'
import { Pencil, Trash, Check } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export const AdDetailsPage = () => {
	const navigate = useNavigate()
	const { showSnackbar } = useSnackbar()
	const { uuid } = useParams()
	const queryClient = useQueryClient()

	const [ad, setAd] = useState<AdDetail | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const [isSoldModalOpen, setIsSoldModalOpen] = useState(false)
	const [isMarkingSold, setIsMarkingSold] = useState(false)

	const fetchAdDetails = async () => {
		try {
			setIsLoading(true)
			setErrorType(null)
			const response = await apiClient(`/api/ads/${uuid}`)

			if (response.status === 400) {
				setErrorType('bad_request')
				await queryClient.clear()
				sessionStorage.removeItem('feed_scroll')
				return
			}
			if (response.status === 404) {
				setErrorType('not_found')
				await queryClient.clear()
				sessionStorage.removeItem('feed_scroll')
				return
			}
			if (!response.ok) throw new Error('server error')

			const rawData = await response.json()

			// ... твой маппинг данных ...
			const adaptedAd: AdDetail = {
				uuid: rawData.uuid,
				title: rawData.title,
				price: rawData.price,
				currency: 'VND',
				city: rawData.city,
				description: rawData.description,
				is_owner: rawData.is_owner,
				owner_username: rawData.owner_username,
				images: rawData.images,
				created_at: rawData.created_at,
			}
			setAd(adaptedAd)
		} catch (err) {
			await queryClient.clear()
			sessionStorage.removeItem('feed_scroll')
			setErrorType('server_error')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchAdDetails()
	}, [uuid])

	useEffect(() => {
		if (sessionStorage.getItem('adUpdated') === 'true') {
			showSnackbar('success', 'Объявление изменено')
			sessionStorage.removeItem('adUpdated')
		}
		if (sessionStorage.getItem('adCreated') === 'true') {
			showSnackbar('success', 'Объявление опубликовано')
			sessionStorage.removeItem('adCreated')
		}
	}, [])

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			const response = await apiClient(`/api/ads/${uuid}`, {
				method: 'DELETE',
			})
			if (!response.ok) throw new Error('Ошибка при удалении')

			setIsDeleteModalOpen(false)
			sessionStorage.setItem('adDeleted', 'true')

			await queryClient.clear()
			sessionStorage.removeItem('feed_scroll')
			navigate(-1)
		} catch (e) {
			showSnackbar('error', 'Ошибка', 'Не удалось удалить объявление')
			setIsDeleteModalOpen(false)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleMarkAsSold = async () => {
		try {
			setIsMarkingSold(true)
			const response = await apiClient(`/api/ads/${uuid}/sold`, {
				method: 'POST',
			})

			if (!response.ok) throw new Error('ошибка')

			setIsSoldModalOpen(false)
		
			await queryClient.clear()
			sessionStorage.removeItem('feed_scroll')
			sessionStorage.setItem('adSold', 'true')
			navigate(-1)
		} catch (e) {
			showSnackbar('error', 'Ошибка', 'Не удалось обновить статус')
			setIsSoldModalOpen(false)
		} finally {
			setIsMarkingSold(false)
		}
	}

	if (isLoading) {
		return <AdDetailLoader />
	}

	if (errorType || !ad) {
		return (
			<ErrorPlaceholder
				errorType={errorType || 'server_error'}
				showHeader={true}
				show500Btn={true}
			/>
		)
	}

	return (
		<>
			<AdDetailHeader uuid={uuid} title={ad?.title} />
			<div
				style={{
					paddingTop: 'calc(61px + env(safe-area-inset-top))',
					// Увеличили отступ снизу, так как кнопок стало больше
					paddingBottom: 80,
				}}
			>
				<ImageGallery images={ad.images || []} />

				<AdDetailInfo
					title={ad.title}
					price={ad.price}
					description={ad.description}
					date={ad.created_at}
					city={ad.city}
				/>
			</div>

			<FixedLayout
				vertical='bottom'
				style={{
					padding: 16,
					background: 'var(--tgui--bg_color)',
					borderTop: '1px solid var(--tgui--secondary_bg_color)',
				}}
			>
				{ad.is_owner ? (
					<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
						<Button
							size='l'
							style={{
								flex: 1,
								backgroundColor: 'var(--tgui--green)',
								color: '#ffffff',
							}}
							onClick={() => setIsSoldModalOpen(true)}
							before={<Check size={20} />}
						>
							Продано
						</Button>

						<Button
							size='l'
							mode='bezeled'
							onClick={() => navigate(`/ads/${ad.uuid}/edit`)}
							style={{
								width: 50,
								height: 50,
								padding: 0,
								flexShrink: 0,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Pencil size={20} />
						</Button>

						<Button
							size='l'
							onClick={() => setIsDeleteModalOpen(true)}
							style={{
								width: 50,
								height: 50,
								padding: 0,
								flexShrink: 0,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: 'var(--tgui--destructive_text_color)',
								color: 'white',
							}}
						>
							<Trash size={20} />
						</Button>
					</div>
				) : (
					<MessageButton username={ad.owner_username} />
				)}
			</FixedLayout>

			<Modal
				header={<Modal.Header>Удаление</Modal.Header>}
				open={isDeleteModalOpen}
				onOpenChange={setIsDeleteModalOpen}
			>
				<div style={{ padding: '0 20px 20px 20px' }}>
					<Text
						style={{
							display: 'block',
							marginBottom: 20,
							textAlign: 'center',
							color: 'var(--tgui--hint_color)',
						}}
					>
						Удалить объявление навсегда?
					</Text>
					<div style={{ display: 'flex', gap: 12 }}>
						<Button
							size='l'
							mode='bezeled'
							stretched
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Отмена
						</Button>
						<Button
							size='l'
							style={{
								backgroundColor: 'var(--tgui--destructive_text_color)',
								color: 'white',
							}}
							stretched
							loading={isDeleting}
							disabled={isDeleting}
							onClick={handleDelete}
						>
							Удалить
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				header={<Modal.Header>Успешная продажа?</Modal.Header>}
				open={isSoldModalOpen}
				onOpenChange={setIsSoldModalOpen}
			>
				<div style={{ padding: '0 20px 20px 20px' }}>
					<Text
						style={{
							display: 'block',
							marginBottom: 20,
							textAlign: 'center',
							color: 'var(--tgui--hint_color)',
						}}
					>
						Поздравляем! Объявление будет снято с публикации и перемещено в
						архив.
					</Text>
					<div style={{ display: 'flex', gap: 12 }}>
						<Button
							size='l'
							mode='bezeled'
							stretched
							onClick={() => setIsSoldModalOpen(false)}
						>
							Eщё продаю
						</Button>
						<Button
							size='l'
							style={{ backgroundColor: 'var(--tgui--green)', color: 'white' }}
							stretched
							loading={isMarkingSold}
							disabled={isMarkingSold}
							onClick={handleMarkAsSold}
						>
							Да, продано!
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

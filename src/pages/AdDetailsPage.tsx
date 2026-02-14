import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from '../providers/SnackbarProvider'
import {
	AppRoot,
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
import { Pencil, Trash } from 'lucide-react'

export const AdDetailsPage = () => {
	const navigate = useNavigate()
	const { showSnackbar } = useSnackbar()

	const { uuid } = useParams()

	const [ad, setAd] = useState<AdDetail | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const fetchAdDetails = async () => {
		try {
			setIsLoading(true)
			setErrorType(null)

			const response = await apiClient(`/api/ads/${uuid}`)

			if (response.status === 400) {
				setErrorType('bad_request')
				return
			}

			if (response.status === 404) {
				setErrorType('not_found')
				return
			}

			if (!response.ok) throw new Error('server error')

			const rawData = await response.json()

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
			showSnackbar(
				'success',
				'Объявление изменено',
			)
			sessionStorage.removeItem('adUpdated')
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
			navigate(-1)
		} catch (e) {
			showSnackbar('error', 'Ошибка', 'Не удалось удалить объявление')
			setIsDeleteModalOpen(false)
		} finally {
			setIsDeleting(false)
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
		<AppRoot>
			<AdDetailHeader uuid={uuid} title={ad?.title} />
			<div
				style={{
					paddingTop: 'calc(61px + env(safe-area-inset-top))',
					paddingBottom: 100,
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
					// --- ЕСЛИ ВЛАДЕЛЕЦ: Показываем "Редактировать" и "Удалить" ---
					<div style={{ display: 'flex', gap: 12 }}>
						<Button
							size='l'
							mode='bezeled'
							stretched
							onClick={() => navigate(`/ads/${ad.uuid}/edit`)} // Переход на редактирование
							before={<Pencil size={18} />}
						>
							Изменить
						</Button>

						<Button
							size='l'
							// mode="destructive" пока не во всех версиях работает, поэтому красим стилями
							style={{
								backgroundColor: 'var(--tgui--destructive_text_color)',
								color: 'white',
							}}
							stretched
							onClick={() => setIsDeleteModalOpen(true)} // Открываем модалку
							before={<Trash size={18} />}
						>
							Удалить
						</Button>
					</div>
				) : (
					<MessageButton username={ad.owner_username} />
				)}
			</FixedLayout>

			<Modal
				header={<Modal.Header>Удаление объявления</Modal.Header>}
				open={isDeleteModalOpen}
				onOpenChange={open => setIsDeleteModalOpen(open)}
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
						Вы действительно хотите удалить это объявление? Это действие нельзя
						будет отменить.
					</Text>

					<div style={{ display: 'flex', gap: 12 }}>
						{/* Кнопка Отмена */}
						<Button
							size='l'
							mode='bezeled'
							stretched
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Отмена
						</Button>

						{/* Кнопка Удалить */}
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
		</AppRoot>
	)
}


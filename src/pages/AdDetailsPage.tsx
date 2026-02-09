import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { AdDetailError } from '../components/AdDetailError'
import { AdDetail } from '../types'
import { apiClient } from '../api/apiClient'
import { Pencil, Trash } from 'lucide-react'

export const AdDetailsPage = () => {
	const navigate = useNavigate()
	
	const { uuid } = useParams()

	const [ad, setAd] = useState<AdDetail | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		const fetchAdDetails = async () => {
			try {
				setIsLoading(true)

				const response = await apiClient(`/api/ads/${uuid}`)

				if (!response.ok) throw new Error('Объявление не найдено')

				const rawData = await response.json()

				const adaptedAd: AdDetail = {
					uuid: rawData.uuid,
					title: rawData.title,
					price: rawData.price,
					currency: 'VND',
					city: rawData.city,
					description: rawData.description,
					is_owner: rawData.is_owner,
					images: rawData.images,
					created_at: rawData.created_at,
				}

				setAd(adaptedAd)
			} catch (err) {
				console.error(err)
				setError('Не удалось загрузить объявление')
			} finally {
				setIsLoading(false)
			}
		}

		fetchAdDetails()
	}, [uuid])

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			const response = await apiClient(`/api/ads/${uuid}`, {
				method: 'DELETE',
			})

			if (!response.ok) throw new Error('Ошибка при удалении')

			// Успех -> закрываем модалку и идем на главную
			setIsDeleteModalOpen(false)
			navigate('/', { replace: true })
		} catch (e) {
			console.error(e)
			alert('Не удалось удалить объявление')
			setIsDeleteModalOpen(false)
		} finally {
			setIsDeleting(false)
		}
	}

	if (isLoading) {
		return <AdDetailLoader />
	}

	if (error || !ad) {
		return <AdDetailError error='Объявление не найдено' />
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
					<MessageButton />
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


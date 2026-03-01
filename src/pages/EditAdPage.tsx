import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	Button,
	List,
	Placeholder,
	Section,
} from '@telegram-apps/telegram-ui'

import { categories } from '../constants'
import { useSnackbar } from '../providers/SnackbarProvider'
import { CategoriesSelect } from '../components/CategoriesSelect'
import { ImageUploader } from '../components/ImageUploader'
import { PublishButton } from '../components/PublishButton'
import { AdTitleField } from '../components/AdTitleField'
import { AdDescriptionField } from '../components/AdDescriptionField'
import { AdPriceField } from '../components/AdPriceField'
import { AdEditHeader } from '../components/AdEditHeader'
import { ErrorPlaceholder, ErrorType } from '../components/ErrorPlaceholder'
import { ImageItem } from '../types'
import { apiClient } from '../api/apiClient'
import { AdDetailLoader } from '../components/AdDetailLoader'
import { useQueryClient } from '@tanstack/react-query'

export const EditAdPage = () => {
	const { uuid } = useParams()
	const navigate = useNavigate()
	const { showSnackbar } = useSnackbar()
	const queryClient = useQueryClient()

	const categoriesWithoutAll = categories.slice(1)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [categoryId, setCategoryId] = useState<number>(
		categoriesWithoutAll[0].id,
	)
	const [images, setImages] = useState<ImageItem[]>([])

	const [isPageLoading, setIsPageLoading] = useState(true) // Загрузка данных объявления
	const [isSaving, setIsSaving] = useState(false) // Загрузка при сохранении
	const [pageError, setPageError] = useState<string | null>(null)
	const [errorType, setErrorType] = useState<ErrorType | null>(null)

	const [errors, setErrors] = useState({
		title: false,
		description: false,
		images: false,
	})

	const MAX_TITLE_LENGTH = 100
	const MAX_DESC_LENGTH = 1000

	useEffect(() => {
		const fetchAdData = async () => {
			try {
				setIsPageLoading(true)
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

				if (response.status === 403) {
					setErrorType('forbidden')
					return
				}

				if (!response.ok) throw new Error('server error')

				const data = await response.json()

				if (data.is_owner === false) {
					setErrorType('forbidden')
					return
				}

				setTitle(data.title)
				setDescription(data.description)
				setPrice(data.price.toString())
				setCategoryId(data.category_id)

				if (data.images) {
					const imageItems: ImageItem[] = data.images.map((url: string) => ({
						id: url,
						file: null,
						preview: url,
						isServer: true,
					}))
					setImages(imageItems)
				}
			} catch (e) {
				setPageError('Не удалось загрузить данные объявления')
			} finally {
				setIsPageLoading(false)
			}
		}

		if (uuid) fetchAdData()
	}, [uuid])

	const handleImagesChange = (newImages: ImageItem[]) => {
		setImages(newImages)
		if (newImages.length > 0 && errors.images) {
			setErrors(prev => ({ ...prev, images: false }))
		}
	}

	// --- Очистка памяти ---
	useEffect(() => {
		return () => {
			images.forEach(img => URL.revokeObjectURL(img.preview))
		}
	}, [])

	const titleChange = (value: string) => {
		if (value.length <= MAX_TITLE_LENGTH) {
			setTitle(value)
			if (errors.title) setErrors(prev => ({ ...prev, title: false }))
		}
	}

	const descriptionChange = (value: string) => {
		if (value.length <= MAX_DESC_LENGTH) {
			setDescription(value)
			if (errors.title) setErrors(prev => ({ ...prev, description: false }))
		}
	}

	// --- СОХРАНЕНИЕ ИЗМЕНЕНИЙ ---
	const handleSave = async () => {
		const rawPrice = price.replace(/\s/g, '')

		const newErrors = {
			title: !title.trim(),
			description: !description.trim(),
			images: images.length === 0,
		}

		setErrors(newErrors)

		if (newErrors.title || newErrors.description || newErrors.images) {
			showSnackbar('error', 'Ошибка', 'Заполните все обязательные поля')
			return
		}

		try {
			setIsSaving(true)

			const formData = new FormData()
			formData.append('title', title)
			formData.append('description', description)
			formData.append('price', rawPrice)
			formData.append('category_id', categoryId.toString())

			images.forEach(img => {
				if (img.file) {
					formData.append('images', img.file)
				} else {
					formData.append('old_images', img.preview)
				}
			})

			const response = await apiClient(`/api/ads/${uuid}`, {
				method: 'PUT',
				body: formData,
			})

			if (!response.ok) throw new Error('Ошибка при обновлении')

			await queryClient.clear()
			sessionStorage.removeItem('feed_scroll')

			sessionStorage.setItem('adUpdated', 'true')
			navigate(-1)
		} catch (e) {
			showSnackbar('error', 'Ошибка', 'Не удалось обновить объявление')
		} finally {
			setIsSaving(false)
		}
	}

	// Если объявление не найдено
	if (pageError) {
		return (
			<Placeholder header='Ошибка' description={pageError}>
				<Button onClick={() => navigate('/')}>На главную</Button>
			</Placeholder>
		)
	}

	if (errorType) {
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
			<AdEditHeader />

			{isPageLoading && <AdDetailLoader />}

			{!isPageLoading && (
				<>
					<div
						style={{
							paddingTop: 'calc(61px + env(safe-area-inset-top))',
							backgroundColor: 'var(--tgui--secondary_bg_color)',
							paddingBottom: 100,
						}}
					>
						<List>
							<Section>
								<ImageUploader
									images={images}
									error={errors.images}
									onChange={handleImagesChange}
								/>
							</Section>
							<Section>
								<CategoriesSelect
									categories={categoriesWithoutAll}
									currentCategoryId={categoryId}
									onCategoryChange={id => setCategoryId(id)}
								/>
								<AdTitleField
									title={title}
									error={errors.title}
									maxLength={MAX_TITLE_LENGTH}
									onChange={titleChange}
								/>
								<AdPriceField price={price} onChange={val => setPrice(val)} />
							</Section>
							<Section>
								<AdDescriptionField
									description={description}
									error={errors.description}
									maxLength={MAX_DESC_LENGTH}
									onChange={descriptionChange}
								/>
							</Section>
						</List>
					</div>

					<PublishButton
						btnText='Сохранить'
						onClick={handleSave}
						loading={isSaving}
					/>
				</>
			)}
		</>
	)
}

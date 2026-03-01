import React, { useState, useEffect } from 'react'
import { categories } from '../constants';
import { useSnackbar } from '../providers/SnackbarProvider'
import { AdCreateHeader } from '../components/AdCreateHeader'
import { CategoriesSelect } from '../components/CategoriesSelect';
import { ImageUploader } from '../components/ImageUploader'
import { PublishButton } from '../components/PublishButton'
import { AdTitleField } from '../components/AdTitleField'
import { AdDescriptionField } from '../components/AdDescriptionField'
import { AdPriceField } from '../components/AdPriceField'
import { ImageItem } from '../types'
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { AdRulesInfo } from '../components/AdRulesInfo';
import { List, Section } from '@telegram-apps/telegram-ui';
import { useQueryClient } from '@tanstack/react-query'
import imageCompression from 'browser-image-compression'

export const CreateAdPage = () => {
	const navigate = useNavigate()
	const { showSnackbar } = useSnackbar()
	const queryClient = useQueryClient()

	const categoriesWithoutAll = categories.slice(1)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [categoryId, setCategoryId] = useState<number>(
		categoriesWithoutAll[0].id
	)
	const [images, setImages] = useState<ImageItem[]>([])
	const [errors, setErrors] = useState({
		title: false,
		description: false,
		images: false,
	})
	const [isLoading, setIsLoading] = useState(false)

	const MAX_TITLE_LENGTH = 100
	const MAX_DESC_LENGTH = 1000

	const handleImagesChange = (newImages: ImageItem[]) => {
		setImages(newImages)
		if (newImages.length > 0 && errors.images) {
			setErrors(prev => ({ ...prev, images: false }))
		}
	}

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

	const priceChange = (value: string) => {
		setPrice(value)
	}

	const hasUsername = Boolean(
		window.Telegram?.WebApp?.initDataUnsafe?.user?.username,
	)

	// Очистка памяти при уходе со страницы
	useEffect(() => {
		return () => {
			images.forEach(img => URL.revokeObjectURL(img.preview))
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const handleSave = async () => {
		if (!hasUsername) {
			showSnackbar(
				'error',
				'Ошибка',
				'Установите Username в настройках Telegram',
			)
			return
		}

		const rawPrice = price.replace(/\s/g, '')

		const newErrors = {
			title: !title.trim(),
			description: !description.trim(),
			images: images.length === 0,
		}

		setErrors(newErrors)

		if (
			newErrors.title ||
			newErrors.description ||
			newErrors.images
		) {
			showSnackbar('error', 'Ошибка', 'Заполните все обязательные поля')
			return
		}

		try {
			setIsLoading(true)

			const formData = new FormData()
			formData.append('title', title)
			formData.append('description', description)
			formData.append('price', rawPrice)
			formData.append('category_id', categoryId.toString())

			// НАСТРОЙКИ СЖАТИЯ
			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 1200,
				useWebWorker: true,
				fileType: 'image/jpeg',
				initialQuality: 0.8,
			}

			for (const img of images) {
				if (img.file) {
					try {
						// Сжимаем и конвертируем
						const compressedFile = await imageCompression(img.file, options)

						const newFileName = img.file.name.replace(/\.[^/.]+$/, '') + '.jpg'
						const fileToSend = new File([compressedFile], newFileName, {
							type: 'image/jpeg',
						})

						formData.append('images', fileToSend)
					} catch (error) {
						console.error('Ошибка сжатия:', error)
						formData.append('images', img.file)
					}
				}
			}

			const response = await apiClient('/api/ads', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('save error')
			}

			const data = await response.json()
			const uuid = data.uuid

			await queryClient.clear()
			sessionStorage.removeItem('feed_scroll')

			navigate(`/ads/${uuid}`, { replace: true })
		} catch (error) {
			showSnackbar('error', 'Ошибка', 'Не удалось опубликовать объявление')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<AdCreateHeader />
			<div
				style={{
					paddingTop: 'calc(61px + env(safe-area-inset-top))',
					paddingBottom: 100,
					backgroundColor: 'var(--tgui--secondary_bg_color)',
				}}
			>
				<List>
					<Section>
						<ImageUploader
							images={images}
							error={errors.images}
							onChange={newImages => handleImagesChange(newImages)}
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
							onChange={titleChange}
							maxLength={MAX_TITLE_LENGTH}
						/>
						<AdPriceField price={price} onChange={priceChange} />
					</Section>

					<Section>
						<AdDescriptionField
							description={description}
							error={errors.description}
							onChange={descriptionChange}
							maxLength={MAX_DESC_LENGTH}
						/>
					</Section>
				</List>

				<AdRulesInfo />
			</div>

			<PublishButton
				btnText='Опубликовать'
				onClick={handleSave}
				loading={isLoading}
			/>
		</>
	)
}

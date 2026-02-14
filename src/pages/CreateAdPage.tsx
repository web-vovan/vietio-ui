import React, { useState, useEffect } from 'react'
import { CircleAlert } from 'lucide-react'
import {
	AppRoot,
	Snackbar,
} from '@telegram-apps/telegram-ui'
import { categories } from '../constants';
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
import { CitySelect } from '../components/CitySelect';

export const CreateAdPage = () => {
	const navigate = useNavigate()

	const categoriesWithoutAll = categories.slice(1)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [categoryId, setCategoryId] = useState<number>(
		categoriesWithoutAll[0].id
	)
	const [images, setImages] = useState<ImageItem[]>([])
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
	const [errors, setErrors] = useState({
		title: false,
		description: false,
		images: false,
	})
	const [isLoading, setIsLoading] = useState(false)

	const [snackbarMessage, setSnackbarMessage] = useState('')
	const showSnackbar = (message: string) => {
		setSnackbarMessage(message)
		setIsSnackbarOpen(true)
	}

	const handleImagesChange = (newImages: ImageItem[]) => {
		setImages(newImages)
		if (newImages.length > 0 && errors.images) {
			setErrors(prev => ({ ...prev, images: false }))
		}
	}

	const titleChange = (value: string) => {
		setTitle(value)
		if (errors.title) setErrors(prev => ({ ...prev, title: false }))
	}

	const descriptionChange = (value: string) => {
		setDescription(value)
		if (errors.description) setErrors(prev => ({ ...prev, description: false }))
	}

	const priceChange = (value: string) => {
		setPrice(value)
	}

	// Очистка памяти при уходе со страницы
	useEffect(() => {
		return () => {
			images.forEach(img => URL.revokeObjectURL(img.preview))
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const handleSave = async () => {
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
			showSnackbar('Заполните все обязательные поля')
			return
		}

		try {
			setIsLoading(true)

			const formData = new FormData()
			formData.append('title', title)
			formData.append('description', description)
			formData.append('price', rawPrice)
			formData.append('category_id', categoryId.toString())

			images.forEach(img => {
				if (img.file) {
					formData.append('images', img.file)
				}
			})

			const response = await apiClient('/api/ads', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('save error')
			}

			await response.json()

			navigate('/', { state: { adCreated: true } })
		} catch (error) {
			showSnackbar('Не удалось опубликовать объявление')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<AppRoot>
			<AdCreateHeader />
			<div
				style={{
					paddingTop: 'calc(61px + env(safe-area-inset-top))',
					paddingBottom: 100,
				}}
			>
				<CategoriesSelect
					categories={categoriesWithoutAll}
					currentCategoryId={categoryId}
					onCategoryChange={id => setCategoryId(id)}
				/>
				<CitySelect />
				<ImageUploader
					images={images}
					error={errors.images}
					onChange={newImages => handleImagesChange(newImages)}
				/>
				<AdTitleField
					title={title}
					error={errors.title}
					onChange={titleChange}
				/>
				<AdDescriptionField
					description={description}
					error={errors.description}
					onChange={descriptionChange}
				/>

				<AdPriceField price={price} onChange={priceChange} />
			</div>

			<PublishButton btnText="Опубликовать" onClick={handleSave} loading={isLoading} />

			{isSnackbarOpen && (
				<Snackbar
					onClose={() => setIsSnackbarOpen(false)}
					before={<CircleAlert size={28} color='#FF3B30' />}
					description={snackbarMessage} 
					style={{ zIndex: 100, marginBottom: 80 }}
				>
					Ошибка
				</Snackbar>
			)}
		</AppRoot>
	)
}

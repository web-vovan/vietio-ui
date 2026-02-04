import React, { useState, useEffect } from 'react'
import { CircleAlert } from 'lucide-react'
import {
	AppRoot,
	List,
	Section,
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
		price: false,
		images: false,
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleImagesChange = (newImages: ImageItem[]) => {
		setImages(newImages)
		if (newImages.length > 0 && errors.images) {
			setErrors(prev => ({ ...prev, images: false }))
		}
	}

	const titleChange = (value: string) => {
		setTitle(value)
		// Убираем ошибку сразу, как пользователь начал печатать
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
			price: !rawPrice,
			images: images.length === 0,
		}

		setErrors(newErrors)

		if (
			newErrors.title ||
			newErrors.description ||
			newErrors.price ||
			newErrors.images
		) {
			setIsSnackbarOpen(true)
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
				throw new Error('Ошибка при сохранении')
			}

			const result = await response.json()
			console.log('Успешно создано:', result)

			navigate('/') 
		} catch (error) {
			console.error('Ошибка отправки:', error)
			// Здесь можно показать другой Snackbar с текстом "Ошибка сети"
			alert('Не удалось опубликовать объявление. Попробуйте позже.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<AppRoot>
			<AdCreateHeader />

			<div style={{ paddingTop: 60, paddingBottom: 80 }}>
				<List>
					<Section header='Что вы продаете?'>
						<CategoriesSelect
							categories={categoriesWithoutAll}
							currentCategoryId={categoryId}
							onCategoryChange={id => setCategoryId(id)}
						/>

						<ImageUploader
							images={images}
							error={errors.images}
							onChange={newImages => handleImagesChange(newImages)}
						/>
					</Section>

					<Section header='Детали'>
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
					</Section>

					<Section header='Стоимость'>
						<AdPriceField price={price} onChange={priceChange} />
					</Section>
				</List>
			</div>

			<PublishButton onClick={handleSave} loading={isLoading} />

			{isSnackbarOpen && (
				<Snackbar
					onClose={() => setIsSnackbarOpen(false)}
					before={<CircleAlert size={28} color='#FF3B30' />}
					description='Проверьте выделенные поля'
					style={{ zIndex: 100, marginBottom: 80 }}
				>
					Заполните все поля
				</Snackbar>
			)}
		</AppRoot>
	)
}

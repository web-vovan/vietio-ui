import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // <-- useParams для получения ID
import { CircleAlert, ChevronLeft } from 'lucide-react'
import {
	AppRoot,
	List,
	Section,
	Snackbar,
	FixedLayout,
	Button,
	Text,
	Spinner,
	Placeholder,
} from '@telegram-apps/telegram-ui'

import { categories } from '../constants'
import { CategoriesSelect } from '../components/CategoriesSelect'
import { ImageUploader } from '../components/ImageUploader'
import { PublishButton } from '../components/PublishButton'
import { AdTitleField } from '../components/AdTitleField'
import { AdDescriptionField } from '../components/AdDescriptionField'
import { AdPriceField } from '../components/AdPriceField'
import { ImageItem } from '../types'
import { apiClient } from '../api/apiClient'

// Вставьте функцию urlToObjectUrl сюда или импортируйте её

export const EditAdPage = () => {
	const { uuid } = useParams() // Получаем ID объявления из URL
	const navigate = useNavigate()
	const categoriesWithoutAll = categories.slice(1)

	// Стейты данных
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [categoryId, setCategoryId] = useState<number>(
		categoriesWithoutAll[0].id,
	)
	const [images, setImages] = useState<ImageItem[]>([])

	// Стейты UI
	const [isPageLoading, setIsPageLoading] = useState(true) // Загрузка данных объявления
	const [isSaving, setIsSaving] = useState(false) // Загрузка при сохранении
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
	const [pageError, setPageError] = useState<string | null>(null)

	const [errors, setErrors] = useState({
		title: false,
		description: false,
		price: false,
		images: false,
	})

	// --- 1. ЗАГРУЗКА ДАННЫХ ПРИ ОТКРЫТИИ ---
	useEffect(() => {
		const fetchAdData = async () => {
			try {
				const response = await apiClient(`/api/ads/${uuid}`)
				if (!response.ok) throw new Error('Объявление не найдено')

				const data = await response.json()

				// Заполняем форму данными с сервера
				setTitle(data.title)
				setDescription(data.description)
				setPrice(data.price.toString())
				setCategoryId(data.category_id)

				// Обработка картинок (самое сложное)
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
				console.error(e)
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

	// --- СОХРАНЕНИЕ ИЗМЕНЕНИЙ ---
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
			setIsSaving(true)

			const formData = new FormData()
			formData.append('title', title)
			formData.append('description', description)
			formData.append('price', rawPrice)
			formData.append('category_id', categoryId.toString())

			// Важный момент: как ваш бэк обновляет фото?
			// Обычно при PUT мы перезаписываем все фото.
			images.forEach(img => {
				if (img.file) {
					// Проверяем, что файл есть
					formData.append('images', img.file)
				} else {
					formData.append('old_images', img.preview)
				}
			})

			// Используем метод PUT (или PATCH)
			const response = await apiClient(`/api/ads/${uuid}`, {
				method: 'PUT',
				body: formData,
			})

			if (!response.ok) throw new Error('Ошибка при обновлении')

			console.log('Успешно обновлено')
			navigate(`/ads/${uuid}`) // Возвращаемся на страницу просмотра
		} catch (e) {
			console.error(e)
		} finally {
			setIsSaving(false)
		}
	}

	// Если идет первоначальная загрузка
	if (isPageLoading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Spinner size='l' />
			</div>
		)
	}

	// Если объявление не найдено
	if (pageError) {
		return (
			<Placeholder header='Ошибка' description={pageError}>
				<Button onClick={() => navigate('/')}>На главную</Button>
			</Placeholder>
		)
	}

	return (
		<AppRoot>
			{/* Шапка для редактирования */}
			<FixedLayout
				vertical='top'
				style={{
					padding: '12px 16px',
					backgroundColor: 'var(--tgui--bg_color)',
					borderBottom: '1px solid var(--tgui--secondary_bg_color)',
					zIndex: 50,
					display: 'flex',
					alignItems: 'center',
					gap: 12,
				}}
			>
				<Button
					mode='plain'
					size='l'
					onClick={() => navigate(-1)}
					style={{
						padding: 0,
						width: 32,
						height: 32,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ChevronLeft size={24} color='var(--tgui--text_color)' />
				</Button>
				<Text weight='2' style={{ fontSize: 18 }}>
					Редактирование
				</Text>
			</FixedLayout>

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
							onChange={handleImagesChange}
						/>
					</Section>

					<Section header='Детали'>
						<AdTitleField
							title={title}
							error={errors.title}
							onChange={val => {
								setTitle(val)
								if (errors.title) setErrors(prev => ({ ...prev, title: false }))
							}}
						/>
						<AdDescriptionField
							description={description}
							error={errors.description}
							onChange={val => {
								setDescription(val)
								if (errors.description)
									setErrors(prev => ({ ...prev, description: false }))
							}}
						/>
					</Section>

					<Section header='Стоимость'>
						<AdPriceField
							price={price}
							onChange={val => {
								setPrice(val)
								if (errors.price) setErrors(prev => ({ ...prev, price: false }))
							}}
						/>
					</Section>
				</List>
			</div>

			<PublishButton onClick={handleSave} loading={isSaving} />

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

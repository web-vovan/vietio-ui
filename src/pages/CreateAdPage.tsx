import React, { useState, useEffect } from 'react'
import { CircleAlert } from 'lucide-react'
import {
	AppRoot,
	FixedLayout,
	List,
	Section,
	Input,
	Textarea,
	Button,
	Text,
	Snackbar,
} from '@telegram-apps/telegram-ui'
import { categories } from '../constants';
import { AdCreateHeader } from '../components/AdCreateHeader'
import { CategoriesSelect } from '../components/CategoriesSelect';
import { ImageUploader } from '../components/ImageUploader'

// Тип для хранения картинки
interface ImageItem {
  id: string;      // Уникальный ID для React key
  file: File;      // Сам файл для отправки
  preview: string; // URL для отображения (blob:...)
}

export const CreateAdPage = () => {
	const categoriesWithoutAll = categories.slice(1)

	// Стейт для полей формы
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [categoryId, setCategoryId] = useState<number>(
		categoriesWithoutAll[0].id
	)
	const [images, setImages] = useState<ImageItem[]>([])

	// Стейт для управления видимостью Снекбара
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

	// Стейт для хранения ошибок
	const [errors, setErrors] = useState({
		title: false,
		description: false,
		price: false,
		images: false,
	})

	const handleImagesChange = (newImages: ImageItem[]) => {
		setImages(newImages)
		if (newImages.length > 0 && errors.images) {
			setErrors(prev => ({ ...prev, images: false }))
		}
	}

	// 3. Очистка памяти при уходе со страницы
	useEffect(() => {
		return () => {
			images.forEach(img => URL.revokeObjectURL(img.preview))
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const handleSave = () => {
		// 1. Очищаем цену от пробелов для проверки
		const rawPrice = price.replace(/\s/g, '')

		// 2. Объект с результатами проверки (true — значит есть ошибка)
		const newErrors = {
			title: !title.trim(), // Ошибка, если название пустое
			description: !description.trim(), // Ошибка, если описание пустое
			price: !rawPrice || Number(rawPrice) <= 0, // Ошибка, если цена 0 или пустая
			images: images.length === 0,
		}

		// 3. Обновляем стейт ошибок
		setErrors(newErrors)

		// 4. Если хотя бы одно поле с ошибкой — останавливаем отправку
		if (
			newErrors.title ||
			newErrors.description ||
			newErrors.price ||
			newErrors.price
		) {
			// Можно добавить вибрацию для тактильной отдачи (Haptic Feedback)
			// window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
			// 1. Показываем уведомление
			setIsSnackbarOpen(true)
			return
		}

		// --- ЕСЛИ ВСЁ ОК, ГОТОВИМ ДАННЫЕ ---

		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('price', rawPrice)
		formData.append('categoryId', categoryId.toString())

		images.forEach(img => {
			formData.append('photos', img.file)
		})

		console.log('Валидация прошла успешно. Отправляем...')
		// await fetch(...)
	}

	// Функция для форматирования: "1000000" -> "1 000 000"
	const formatPriceInput = (value: string) => {
		// 1. Удаляем всё, кроме цифр (никаких букв, минусов, пробелов)
		const number = value.replace(/\D/g, '')

		// 2. Если пусто, возвращаем пустоту
		if (number === '') return ''

		// 3. Форматируем с пробелами
		return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	}

	return (
		<AppRoot>
			<AdCreateHeader />

			<div style={{ paddingTop: 60, paddingBottom: 80 }}>
				<List>
					{/* СЕКЦИЯ 1: ЧТО ПРОДАЕМ (Категория + Фото) */}
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

					{/* СЕКЦИЯ 2: ОПИСАНИЕ */}
					<Section header='Детали'>
						<Input
							header='Название'
							placeholder='Например, iPhone 15 Pro'
							value={title}
							onChange={e => {
								setTitle(e.target.value)
								// Убираем ошибку сразу, как пользователь начал печатать
								if (errors.title) setErrors(prev => ({ ...prev, title: false }))
							}}
							// ВАЖНО: Подсветка красным
							status={errors.title ? 'error' : 'default'}
						/>
						{/* Текст ошибки */}
						{errors.title && (
							<Text
								style={{
									color: 'var(--tgui--destructive_text_color)',
									fontSize: 13,
									padding: '0 20px 10px 20px',
									marginTop: -8,
								}}
							>
								Добавьте название товара
							</Text>
						)}

						<Textarea
							header='Описание'
							placeholder='Состояние, особенности...'
							value={description}
							onChange={e => {
								setDescription(e.target.value)
								if (errors.description)
									setErrors(prev => ({ ...prev, description: false }))
							}}
							status={errors.description ? 'error' : 'default'}
						/>
						{errors.description && (
							<Text
								style={{
									color: 'var(--tgui--destructive_text_color)',
									fontSize: 13,
									padding: '0 20px 10px 20px',
									marginTop: -8,
								}}
							>
								Добавьте описание товара
							</Text>
						)}
					</Section>

					{/* СЕКЦИЯ 3: ЦЕНА */}
					<Section header='Стоимость'>
						<Input
							header='Цена (VND)'
							placeholder='0'
							type='text'
							inputMode='numeric'
							value={price}
							onChange={e => setPrice(formatPriceInput(e.target.value))}
							after={
								<Text style={{ color: 'var(--tgui--hint_color)' }}>₫</Text>
							}
						/>
					</Section>
				</List>
			</div>

			{/* --- 3. ФИКСИРОВАННАЯ КНОПКА СОХРАНИТЬ --- */}
			<FixedLayout
				vertical='bottom'
				style={{
					padding: 16,
					backgroundColor: 'var(--tgui--bg_color)',
					borderTop: '1px solid var(--tgui--secondary_bg_color)',
				}}
			>
				<Button
					size='l'
					stretched // Растягивает кнопку на всю ширину
					onClick={handleSave}
				>
					Опубликовать
				</Button>
			</FixedLayout>

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

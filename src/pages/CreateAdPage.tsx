import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleAlert, Camera, ChevronLeft, X } from 'lucide-react'
import {
	AppRoot,
	FixedLayout,
	List,
	Section,
	Input,
	Textarea,
	Button,
	Text,
	Select,
	Snackbar,
	// Placeholder,
} from '@telegram-apps/telegram-ui'

// Список категорий для выбора (ID 0 "Все" здесь не нужен)
const categories = [
	{ id: 1, name: 'Авто', icon: '🚗' },
	{ id: 2, name: 'Недвижимость', icon: '🏠' },
	{ id: 3, name: 'Работа', icon: '💼' },
	{ id: 4, name: 'Техника', icon: '📱' },
	{ id: 5, name: 'Одежда', icon: '👕' },
	{ id: 6, name: 'Для дома', icon: '🛋️' },
	{ id: 7, name: 'Услуги', icon: '🛠️' },
];

// Тип для хранения картинки
interface ImageItem {
  id: string;      // Уникальный ID для React key
  file: File;      // Сам файл для отправки
  preview: string; // URL для отображения (blob:...)
}

const MAX_PHOTOS = 3

export const CreateAdPage = () => {
	const navigate = useNavigate()

	// Стейт для полей формы
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [categoryId, setCategoryId] = useState<number>(categories[0].id)

	// --- НОВОЕ: Стейт картинок ---
	const [images, setImages] = useState<ImageItem[]>([])

	// Стейт для управления видимостью Снекбара
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

	// Стейт для хранения ошибок (какие поля пустые)
	const [errors, setErrors] = useState({
		title: false,
		description: false,
		price: false,
		images: false,
	})

	// Ссылка на скрытый инпут
	const fileInputRef = useRef<HTMLInputElement>(null)

	// 1. Обработка выбора файлов
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files

		// Проверка, что файлы вообще выбраны
		if (!files || files.length === 0) return

		// 1. Считаем свободные слоты
		const availableSlots = MAX_PHOTOS - images.length

		// Если мест нет — выходим (на всякий случай)
		if (availableSlots <= 0) {
			alert('Достигнут лимит фотографий')
			return
		}

		// 2. Превращаем FileList в массив
		const allSelectedFiles = Array.from(files)

		// 3. ВАЖНО: Обрезаем массив.
		// Если слотов 2, а выбрали 4 -> берем только первые 2.
		const filesToProcess = allSelectedFiles.slice(0, availableSlots)

		// (Опционально) Можно предупредить пользователя, если он выбрал слишком много
		if (allSelectedFiles.length > availableSlots) {
			// Здесь можно подключить TGUI Snackbar/Toast, но пока просто в лог
			console.log(
				`Выбрано ${allSelectedFiles.length}, загружено только ${availableSlots}`
			)
		}

		const newImages: ImageItem[] = filesToProcess.map(file => ({
			id: crypto.randomUUID(), // Или Date.now().toString() + Math.random()
			file,
			preview: URL.createObjectURL(file),
		}))

		setImages(prev => [...prev, ...newImages])

		if (errors.images) setErrors(prev => ({ ...prev, images: false }))

		// Сбрасываем инпут, чтобы можно было выбрать те же файлы, если пользователь удалит их и захочет вернуть
		e.target.value = ''
	}

	// 2. Удаление картинки
	const handleRemoveImage = (idToRemove: string) => {
		setImages(prev => {
			// Находим удаляемую картинку, чтобы очистить память
			const imageToRemove = prev.find(img => img.id === idToRemove)
			if (imageToRemove) {
				URL.revokeObjectURL(imageToRemove.preview)
			}
			return prev.filter(img => img.id !== idToRemove)
		})
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
			{/* --- 1. ФИКСИРОВАННАЯ ШАПКА --- */}
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
				{/* Кнопка НАЗАД */}
				<Button
					mode='plain'
					size='l'
					onClick={() => navigate(-1)} // Возвращает на предыдущую страницу
					style={{
						padding: 0,
						width: 32,
						height: 32,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ChevronLeft size={28} color='var(--tgui--link_color)' />
				</Button>

				{/* Заголовок страницы */}
				<Text weight='2' style={{ fontSize: 18 }}>
					Новое объявление
				</Text>
			</FixedLayout>

			<div style={{ paddingTop: 60, paddingBottom: 80 }}>
				<List>
					{/* СЕКЦИЯ 1: ЧТО ПРОДАЕМ (Категория + Фото) */}
					<Section header='Что вы продаете?'>
						{/* 1. Сначала выбираем категорию */}
						<Select
							// header="Категория" // Можно убрать header внутри, так как есть заголовок секции
							value={categoryId}
							onChange={e => setCategoryId(Number(e.target.value))}
						>
							{categories.map(c => (
								<option key={c.id} value={c.id}>
									{c.icon} {c.name}
								</option>
							))}
						</Select>

						{/* 2. Сразу под ней — Фотографии */}
						{/* Скрытый инпут */}
						<input
							type='file'
							ref={fileInputRef}
							multiple
							accept='image/*'
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>

						<div
							style={{
								display: 'flex',
								overflowX: 'auto',
								padding: 12,
								gap: 12,
								// ДОБАВИЛИ РАМКУ ПРИ ОШИБКЕ:
								border: errors.images
									? '1px solid var(--tgui--destructive_text_color)'
									: '1px solid transparent',
								borderRadius: 16, // Скругление рамки
								transition: 'border 0.2s',
							}}
							className='hide-scrollbar'
						>
							{/* Кнопка Добавить */}
							<div
								onClick={() => {
									if (images.length < MAX_PHOTOS) fileInputRef.current?.click()
								}}
								style={{
									width: 80,
									height: 80,
									minWidth: 80,
									borderRadius: 12,
									backgroundColor: 'var(--tgui--secondary_bg_color)',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: images.length < MAX_PHOTOS ? 'pointer' : 'default',
									opacity: images.length >= MAX_PHOTOS ? 0.5 : 1,
								}}
							>
								<Camera size={28} color='var(--tgui--link_color)' />
								<Text
									style={{
										fontSize: 12,
										marginTop: 4,
										color: 'var(--tgui--link_color)',
									}}
								>
									{images.length >= MAX_PHOTOS ? 'Лимит' : 'Фото'}
								</Text>
								<Text
									style={{ fontSize: 10, color: 'var(--tgui--hint_color)' }}
								>
									{images.length}/{MAX_PHOTOS}
								</Text>
							</div>

							{/* Превьюшки */}
							{images.map(img => (
								<div
									key={img.id}
									style={{
										position: 'relative',
										width: 80,
										height: 80,
										minWidth: 80,
									}}
								>
									<img
										src={img.preview}
										alt='preview'
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											borderRadius: 12,
										}}
									/>
									<div
										onClick={() => handleRemoveImage(img.id)}
										style={{
											position: 'absolute',
											top: -6,
											right: -6,
											width: 22,
											height: 22,
											backgroundColor: 'rgba(0,0,0,0.5)',
											borderRadius: '50%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
											backdropFilter: 'blur(4px)',
										}}
									>
										<X size={14} color='#ffffff' strokeWidth={3} />
									</div>
								</div>
							))}
							{/* ТЕКСТ ОШИБКИ ДЛЯ ФОТО */}
							{errors.images && (
								<Text
									style={{
										color: 'var(--tgui--destructive_text_color)',
										fontSize: 13,
										padding: '0 20px 10px 20px', // Отступы как у других ошибок
										marginTop: -4,
									}}
								>
									Загрузите хотя бы одну фотографию
								</Text>
							)}
						</div>
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

			{/* 
				--- ВСТАВЛЯЕМ SNACKBAR В САМЫЙ КОНЕЦ --- 
				Желательно перед </AppRoot>.
				Компонент сам позиционируется снизу экрана.
			*/}
			{isSnackbarOpen && (
				<Snackbar
					onClose={() => setIsSnackbarOpen(false)}
					before={<CircleAlert size={28} color='#FF3B30' />}
					description='Проверьте выделенные поля'
					// Чтобы он был поверх кнопки "Опубликовать", можно добавить стиль
					style={{ zIndex: 100, marginBottom: 80 }}
				>
					Заполните все поля
				</Snackbar>
			)}
		</AppRoot>
	)
}

import { useRef } from "react"

import {
	Text,
} from '@telegram-apps/telegram-ui'
import { Camera, CircleAlert, X } from "lucide-react"
import { ImageItem } from "../types"

type ImageUploaderProps = {
    images: ImageItem[]
    error: boolean
    onChange: (images: ImageItem[]) => void // обновление списка
}

export const ImageUploader = ({ error, images, onChange }: ImageUploaderProps) => {
	const MAX_PHOTOS = 3
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

		onChange([...images, ...newImages])

		// if (errors.images) setErrors(prev => ({ ...prev, images: false }))

		// Сбрасываем инпут, чтобы можно было выбрать те же файлы, если пользователь удалит их и захочет вернуть
		e.target.value = ''
	}

    const handleRemoveImage = (idToRemove: string) => {
        // Находим удаляемую картинку, чтобы очистить память
        const imageToRemove = images.find(img => img.id === idToRemove)
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview)
        }
        onChange(images.filter(img => img.id !== idToRemove))
	}

	const handleAddClick = () => {
		if (images.length < MAX_PHOTOS) fileInputRef.current?.click()
	}
	return (
		<>
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
					padding: '12px 20px',
					gap: 12,
					transition: 'border 0.2s',
				}}
				className='hide-scrollbar'
			>
				{/* Кнопка Добавить */}
				<div
					onClick={handleAddClick}
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
					<Text style={{ fontSize: 10, color: 'var(--tgui--hint_color)' }}>
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
				{error && (
					<div
						style={{
							display: 'flex',
							alignItems: 'center', // Выравниваем по вертикали
							gap: 6, // Отступ между иконкой и текстом
							padding: '0 20px 10px 20px',
							marginTop: -4,
							color: 'var(--tgui--destructive_text_color)', // Красный цвет для всего блока
						}}
					>
						{/* Иконка */}
						<CircleAlert size={24} />

						{/* Текст */}
						<Text style={{ fontSize: 13, lineHeight: '16px' }}>
							Загрузите хотя бы одну фотографию
						</Text>
					</div>
				)}
			</div>
		</>
	)
}
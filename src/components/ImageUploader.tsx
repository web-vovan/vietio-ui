import { useRef } from "react"

import {
	Text,
} from '@telegram-apps/telegram-ui'
import { Camera, CircleAlert, X } from "lucide-react"
import { ImageItem } from "../types"

type ImageUploaderProps = {
    images: ImageItem[]
    error: boolean
    onChange: (images: ImageItem[]) => void 
}

export const ImageUploader = ({ error, images, onChange }: ImageUploaderProps) => {
	const MAX_PHOTOS = 3
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files

		if (!files || files.length === 0) return

		const availableSlots = MAX_PHOTOS - images.length

		if (availableSlots <= 0) {
			return
		}

		const allSelectedFiles = Array.from(files)

		const filesToProcess = allSelectedFiles.slice(0, availableSlots)

		if (allSelectedFiles.length > availableSlots) {
			console.log(
				`Выбрано ${allSelectedFiles.length}, загружено только ${availableSlots}`
			)
		}

		const newImages: ImageItem[] = filesToProcess.map(file => ({
			id: crypto.randomUUID(), 
			file,
			preview: URL.createObjectURL(file),
		}))

		onChange([...images, ...newImages])

		// if (errors.images) setErrors(prev => ({ ...prev, images: false }))

		e.target.value = ''
	}

    const handleRemoveImage = (idToRemove: string) => {
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
					<Camera
						size={28}
						style={{
							marginTop: 4,
							color: 'var(--tgui--link_color)',
						}}
						color='var(--tgui--link_color)'
					/>
					<Text
						style={{
							fontSize: 12,
							color: 'var(--tgui--link_color)',
						}}
					>
						{images.length >= MAX_PHOTOS ? 'Лимит' : 'Фото'}
					</Text>
					<Text style={{ fontSize: 10, color: 'var(--tgui--hint_color)' }}>
						{images.length}/{MAX_PHOTOS}
					</Text>
				</div>

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
							alignItems: 'center',
							gap: 6,
							padding: '0 20px 10px 20px',
							marginTop: -4,
							color: 'var(--tgui--destructive_text_color)',
						}}
					>
						<CircleAlert size={24} />

						<Text style={{ fontSize: 13, lineHeight: '16px' }}>
							Загрузите хотя бы одну фотографию
						</Text>
					</div>
				)}
			</div>
		</>
	)
}
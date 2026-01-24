import React, { useState } from 'react'
// import { Placeholder } from '@telegram-apps/telegram-ui'
import { Camera } from 'lucide-react'

interface ImageGalleryProps {
	images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
	const [activeIndex, setActiveIndex] = useState(0)

	// Обработчик скролла для обновления активной точки
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const scrollLeft = e.currentTarget.scrollLeft
		const width = e.currentTarget.offsetWidth
		const index = Math.round(scrollLeft / width)
		setActiveIndex(index)
	}

	// Если картинок нет - показываем заглушку
	if (!images || images.length === 0) {
		return (
			<div
				style={{
					height: 300,
					backgroundColor: 'var(--tgui--secondary_bg_color)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					color: 'var(--tgui--hint_color)',
				}}
			>
				<Camera size={48} />
				<span style={{ marginTop: 8 }}>Нет фото</span>
			</div>
		)
	}

	return (
		<div style={{ position: 'relative', height: 300, backgroundColor: '#000' }}>
			{/* Слайдер */}
			<div
				className='hide-scrollbar'
				onScroll={handleScroll}
				style={{
					display: 'flex',
					overflowX: 'auto',
					scrollSnapType: 'x mandatory', // Магия CSS для покадрового скролла
					height: '100%',
					width: '100%',
				}}
			>
				{images.map((src, index) => (
					<img
						key={index}
						src={src}
						alt={`slide-${index}`}
						style={{
							minWidth: '100%',
							height: '100%',
							objectFit: 'contain', // Чтобы фото влезало целиком (или 'cover' для заполнения)
							scrollSnapAlign: 'center',
						}}
					/>
				))}
			</div>

			{/* Индикаторы (точки) */}
			{images.length > 1 && (
				<div
					style={{
						position: 'absolute',
						bottom: 16,
						left: 0,
						right: 0,
						display: 'flex',
						justifyContent: 'center',
						gap: 6,
					}}
				>
					{images.map((_, i) => (
						<div
							key={i}
							style={{
								width: i === activeIndex ? 8 : 6,
								height: i === activeIndex ? 8 : 6,
								borderRadius: '50%',
								backgroundColor:
									i === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)',
								transition: 'all 0.2s',
							}}
						/>
					))}
				</div>
			)}
		</div>
	)
}

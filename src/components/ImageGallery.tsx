import React, { useState, useRef, useEffect } from 'react'
import { Camera, X } from 'lucide-react'
import { IconButton } from '@telegram-apps/telegram-ui'

interface ImageGalleryProps {
	images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
	const [activeIndex, setActiveIndex] = useState(0)

	// Состояние для полноэкранного режима
	const [isFullScreen, setIsFullScreen] = useState(false)

	// Рефы для скролл-контейнеров
	const sliderRef = useRef<HTMLDivElement>(null)
	const fullScreenSliderRef = useRef<HTMLDivElement>(null)

	// Обработчик скролла (универсальный)
	const handleScroll = (
		e: React.UIEvent<HTMLDivElement>,
		setIndex: (i: number) => void,
	) => {
		const scrollLeft = e.currentTarget.scrollLeft
		const width = e.currentTarget.offsetWidth
		const index = Math.round(scrollLeft / width)
		setIndex(index)
	}

	// Блокировка скролла основного сайта, когда открыт фуллскрин
	useEffect(() => {
		if (isFullScreen) {
			document.body.style.overflow = 'hidden'
			// При открытии прокручиваем к текущему слайду
			if (fullScreenSliderRef.current) {
				fullScreenSliderRef.current.scrollLeft =
					fullScreenSliderRef.current.offsetWidth * activeIndex
			}
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isFullScreen, activeIndex]) // activeIndex здесь нужен, чтобы при открытии попасть на нужное фото

	// Обработчик клика по фото (открытие)
	const handleImageClick = (index: number) => {
		setActiveIndex(index) // Синхронизируем индекс
		setIsFullScreen(true)
	}

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
		<>
			{/* --- МАЛЕНЬКАЯ ГАЛЕРЕЯ (КАК БЫЛО) --- */}
			<div
				style={{
					position: 'relative',
					height: 300,
					backgroundColor: 'var(--tgui--bg_color)',
				}}
			>
				<div
					ref={sliderRef}
					className='hide-scrollbar'
					onScroll={e => handleScroll(e, setActiveIndex)}
					style={{
						display: 'flex',
						overflowX: 'auto',
						scrollSnapType: 'x mandatory',
						height: '100%',
						width: '100%',
						scrollbarWidth: 'none',
					}}
				>
					{images.map((src, index) => (
						<div
							key={index}
							onClick={() => handleImageClick(index)} // <--- Клик для открытия
							style={{
								minWidth: '100%',
								height: '100%',
								position: 'relative',
								scrollSnapAlign: 'center',
								overflow: 'hidden',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{/* Размытый фон */}
							<img
								src={src}
								alt=''
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									filter: 'blur(20px) brightness(0.7)', // Чуть темнее фон
									transform: 'scale(1.1)',
									zIndex: 1,
								}}
							/>
							{/* Основное фото */}
							<img
								src={src}
								alt={`slide-${index}`}
								style={{
									maxWidth: '100%',
									maxHeight: '100%',
									width: 'auto',
									height: 'auto',
									objectFit: 'contain',
									position: 'relative',
									zIndex: 2,
									boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
								}}
							/>
						</div>
					))}
				</div>

				{/* Индикаторы (Точки) */}
				{images.length > 1 && (
					<div
						style={{
							position: 'absolute',
							bottom: 12,
							left: 0,
							right: 0,
							display: 'flex',
							justifyContent: 'center',
							gap: 6,
							zIndex: 10,
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

			{/* --- ПОЛНОЭКРАННЫЙ РЕЖИМ --- */}
			{isFullScreen && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: '#000', // Черный фон
						zIndex: 9999, // Поверх всего (даже хедера Telegram UI)
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{/* Кнопка закрыть */}
					<div
						style={{
							position: 'absolute',
							top: 'calc(10px + env(safe-area-inset-top))', // Учитываем челку
							right: 16,
							zIndex: 10001,
						}}
					>
						<IconButton
							mode='plain'
							size='l'
							onClick={() => setIsFullScreen(false)}
							style={{
								color: '#fff',
								backgroundColor: 'rgba(0,0,0,0.5)',
								borderRadius: '50%',
							}}
						>
							<X size={28} />
						</IconButton>
					</div>

					{/* Слайдер на весь экран */}
					<div
						ref={fullScreenSliderRef}
						className='hide-scrollbar'
						// Здесь мы обновляем activeIndex, чтобы при закрытии вернуться к тому же фото
						onScroll={e => handleScroll(e, setActiveIndex)}
						style={{
							display: 'flex',
							overflowX: 'auto',
							scrollSnapType: 'x mandatory',
							height: '100%',
							width: '100%',
							scrollbarWidth: 'none',
							alignItems: 'center', // Центрируем вертикально
						}}
					>
						{images.map((src, index) => (
							<div
								key={index}
								style={{
									minWidth: '100%', // 100% ширины экрана
									height: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									scrollSnapAlign: 'center',
									position: 'relative',
								}}
							>
								<img
									src={src}
									alt={`full-slide-${index}`}
									style={{
										maxWidth: '100%',
										maxHeight: '100%',
										objectFit: 'contain', // Фото целиком
										userSelect: 'none',
									}}
								/>
							</div>
						))}
					</div>

					{/* Счетчик фото внизу (для удобства) */}
					<div
						style={{
							position: 'absolute',
							bottom: 'calc(20px + env(safe-area-inset-bottom))',
							left: 0,
							right: 0,
							textAlign: 'center',
							color: 'rgba(255,255,255,0.8)',
							fontSize: 14,
							pointerEvents: 'none',
						}}
					>
						{activeIndex + 1} из {images.length}
					</div>
				</div>
			)}
		</>
	)
}

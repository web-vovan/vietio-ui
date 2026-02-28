import React, { useState, useEffect, useCallback } from 'react'
import { Camera, X } from 'lucide-react'
import { IconButton } from '@telegram-apps/telegram-ui'
import useEmblaCarousel from 'embla-carousel-react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
// 1. Импортируем компоненты зума
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

interface ImageGalleryProps {
	images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [isFullScreen, setIsFullScreen] = useState(false)

	// Состояние: увеличена ли текущая картинка
	const [isZoomed, setIsZoomed] = useState(false)

	// --- EMBLA: Маленькая галерея ---
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: 'center',
		containScroll: 'trimSnaps',
		duration: 40,
	})

	// --- EMBLA: Полноэкранная галерея ---
	const [fullScreenRef, fullScreenApi] = useEmblaCarousel({
		startIndex: activeIndex,
		align: 'center',
		containScroll: 'trimSnaps',
		duration: 80,
		dragFree: false,
		// Отключаем свайп слайдов, если картинка увеличена
		watchDrag: !isZoomed,
	})

	const onSelect = useCallback((api: any) => {
		if (!api) return
		setActiveIndex(api.selectedScrollSnap())
		// При смене слайда всегда сбрасываем зум (логика внутри слайда сработает отдельно)
		setIsZoomed(false)
	}, [])

	useEffect(() => {
		if (!emblaApi) return
		emblaApi.on('select', onSelect)
		onSelect(emblaApi)
	}, [emblaApi, onSelect])

	useEffect(() => {
		if (!fullScreenApi) return
		fullScreenApi.reInit({ watchDrag: !isZoomed }) // Обновляем настройки Embla при зуме
		fullScreenApi.on('select', onSelect)
	}, [fullScreenApi, onSelect, isZoomed])

	// --- ЖЕСТЫ И АНИМАЦИЯ (Закрытие) ---
	const [{ y, bgOpacity }, api] = useSpring(() => ({
		y: 0,
		bgOpacity: 1,
		config: { tension: 300, friction: 30 },
	}))

	const closeGallery = () => {
		setIsFullScreen(false)
		setIsZoomed(false)
		setTimeout(() => {
			api.start({ y: 0, bgOpacity: 1, immediate: true })
		}, 300)
	}

	const bind = useDrag(
		({
			active,
			movement: [, my],
			velocity: [, vy],
			direction: [, dy],
			cancel,
		}) => {
			// БЛОКИРУЕМ закрытие, если картинка увеличена
			if (isZoomed) return

			if (my < -50) cancel()

			if (active) {
				api.start({
					y: my,
					bgOpacity: Math.max(0, 1 - my / 500),
					immediate: true,
				})
			} else {
				// eslint-disable-next-line @typescript-eslint/no-extra-parens
				if (my > 150 || (vy > 0.5 && dy > 0)) {
					api.start({ y: window.innerHeight, bgOpacity: 0 })
					closeGallery()
				} else {
					api.start({ y: 0, bgOpacity: 1 })
				}
			}
		},
		{
			axis: 'y',
			filterTaps: true,
			from: () => [0, y.get()],
			rubberband: true,
			// Отключаем жест, если зум активен, чтобы не мешать панорамированию
			enabled: !isZoomed,
		},
	)

	const openFullScreen = (index: number) => {
		setActiveIndex(index)
		setIsFullScreen(true)
		setIsZoomed(false)
		if (emblaApi) emblaApi.scrollTo(index)
		if (fullScreenApi) fullScreenApi.scrollTo(index)
		api.start({ y: 0, bgOpacity: 1, immediate: true })
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
			{/* --- МАЛЕНЬКАЯ ГАЛЕРЕЯ (Без изменений) --- */}
			<div
				style={{
					position: 'relative',
					height: 300,
					backgroundColor: 'var(--tgui--bg_color)',
					overflow: 'hidden',
				}}
			>
				<div
					className='embla'
					ref={emblaRef}
					style={{ height: '100%', overflow: 'hidden' }}
				>
					<div
						className='embla__container'
						style={{ display: 'flex', height: '100%' }}
					>
						{images.map((src, index) => (
							<div
								key={index}
								onClick={() => openFullScreen(index)}
								style={{
									flex: '0 0 100%',
									minWidth: 0,
									position: 'relative',
									height: '100%',
								}}
							>
								<div
									style={{
										width: '100%',
										height: '100%',
										backgroundColor: 'var(--tgui--secondary_bg_color)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<img
										src={src}
										alt={`slide-${index}`}
										loading={index === 0 ? 'eager' : 'lazy'}
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain',
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Индикаторы */}
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
							pointerEvents: 'none',
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
										i === activeIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)',
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
						zIndex: 9999,
						touchAction: 'none',
					}}
				>
					{/* Фон */}
					<animated.div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: '#000',
							opacity: bgOpacity,
							zIndex: -1,
						}}
					/>

					{/* Кнопка закрытия */}
					<animated.div
						style={{
							position: 'absolute',
							top: 'calc(10px + env(safe-area-inset-top))',
							right: 16,
							zIndex: 10001,
							opacity: bgOpacity,
						}}
					>
						<IconButton
							mode='plain'
							size='l'
							onClick={closeGallery}
							style={{
								color: '#fff',
								backgroundColor: 'rgba(0,0,0,0.5)',
								borderRadius: '50%',
							}}
						>
							<X size={28} />
						</IconButton>
					</animated.div>

					{/* Слайдер */}
					<animated.div
						{...bind()} // Хук закрытия висит на контейнере
						className='embla embla--fullscreen'
						ref={fullScreenRef}
						style={{
							height: '100%',
							overflow: 'hidden',
							y: y,
							touchAction: 'none', // Важно для жестов зума
						}}
					>
						<div
							className='embla__container'
							style={{ display: 'flex', height: '100%' }}
						>
							{images.map((src, index) => (
								<div
									key={index}
									style={{
										flex: '0 0 100%',
										minWidth: 0,
										height: '100%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										// Важно разрешить выделение, чтобы зум работал корректно
										userSelect: 'none',
									}}
								>
									{/* Обертка для зума */}
									<TransformWrapper
										initialScale={1}
										minScale={1}
										maxScale={4} // Максимальный зум
										// Отключаем панорамирование, если масштаб 1.
										// Это позволяет событию свайпа "пройти сквозь" картинку к Embla или useDrag
										panning={{ disabled: !isZoomed }}
										// Pinch и DoubleClick работают всегда, чтобы инициировать зум
										pinch={{ disabled: false }}
										doubleClick={{ disabled: false }}
										// Следим за трансформацией
										onTransformed={e => {
											// Если масштаб больше 1 (+ погрешность), считаем что зум активен
											setIsZoomed(e.state.scale > 1.01)
										}}
									>
										{/* Компонент, который трансформируется */}
										<TransformComponent
											wrapperStyle={{
												width: '100%',
												height: '100%',
											}}
											contentStyle={{
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<img
												src={src}
												alt={`full-slide-${index}`}
												style={{
													maxWidth: '100%',
													maxHeight: '100%',
													objectFit: 'contain',
													pointerEvents: 'auto', // Включаем события для картинки
												}}
											/>
										</TransformComponent>
									</TransformWrapper>
								</div>
							))}
						</div>
					</animated.div>

					{/* Счетчик */}
					<animated.div
						style={{
							position: 'absolute',
							bottom: 40,
							width: '100%',
							textAlign: 'center',
							color: '#fff',
							opacity: bgOpacity,
							pointerEvents: 'none',
						}}
					>
						{activeIndex + 1} из {images.length}
					</animated.div>
				</div>
			)}
		</>
	)
}

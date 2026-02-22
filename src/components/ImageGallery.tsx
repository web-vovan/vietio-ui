import React, { useState, useEffect, useCallback } from 'react'
import { Camera, X } from 'lucide-react'
import { IconButton } from '@telegram-apps/telegram-ui'
import useEmblaCarousel from 'embla-carousel-react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

interface ImageGalleryProps {
	images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [isFullScreen, setIsFullScreen] = useState(false)

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
		dragFree: true,
	})

	const onSelect = useCallback((api: any) => {
		if (!api) return
		setActiveIndex(api.selectedScrollSnap())
	}, [])

	useEffect(() => {
		if (!emblaApi) return
		emblaApi.on('select', onSelect)
		onSelect(emblaApi)
	}, [emblaApi, onSelect])

	useEffect(() => {
		if (!fullScreenApi) return
		fullScreenApi.on('select', onSelect)
	}, [fullScreenApi, onSelect])

	// --- ЖЕСТЫ И АНИМАЦИЯ ---
	// Убрали scale из конфигурации
	const [{ y, bgOpacity }, api] = useSpring(() => ({
		y: 0,
		bgOpacity: 1,
		config: { tension: 300, friction: 30 },
	}))

	const closeGallery = () => {
		setIsFullScreen(false)
		setTimeout(() => {
			// Сброс только позиции и прозрачности
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
			if (my < -50) cancel()

			if (active) {
				api.start({
					y: my,
					bgOpacity: Math.max(0, 1 - my / 500), // Только прозрачность
					immediate: true,
				})
			} else {
				// eslint-disable-next-line @typescript-eslint/no-extra-parens
				if (my > 150 || (vy > 0.5 && dy > 0)) {
					// Улетаем вниз без изменения размера
					api.start({ y: window.innerHeight, bgOpacity: 0 })
					closeGallery()
				} else {
					// Возврат на место
					api.start({ y: 0, bgOpacity: 1 })
				}
			}
		},
		{
			axis: 'y',
			filterTaps: true,
			from: () => [0, y.get()],
			rubberband: true,
		},
	)

	const openFullScreen = (index: number) => {
		setActiveIndex(index)
		setIsFullScreen(true)
		if (emblaApi) emblaApi.scrollTo(index)
		// Сброс при открытии
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
			{/* --- МАЛЕНЬКАЯ ГАЛЕРЕЯ --- */}
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
										position: 'relative',
										backgroundColor: 'var(--tgui--secondary_bg_color)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<div
										style={{
											position: 'absolute',
											opacity: 0.3,
											color: 'var(--tgui--hint_color)',
										}}
									>
										<Camera size={32} />
									</div>

									<img
										src={src}
										alt={`slide-${index}`}
										loading={index === 0 ? 'eager' : 'lazy'}
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain',
											zIndex: 2,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Точки */}
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
									boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
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

					<animated.div
						{...bind()}
						className='embla embla--fullscreen'
						ref={fullScreenRef}
						style={{
							height: '100%',
							overflow: 'hidden',
							y: y, // Только Y, без scale
							touchAction: 'pan-x',
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
										userSelect: 'none',
									}}
								>
									<img
										src={src}
										alt={`full-slide-${index}`}
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain',
											pointerEvents: 'none',
										}}
									/>
								</div>
							))}
						</div>
					</animated.div>

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

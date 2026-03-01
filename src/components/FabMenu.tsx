import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@telegram-apps/telegram-ui'
import { Plus, User } from 'lucide-react'

type FabMenuProps = {
	showProfileBtn: boolean
	useAnimation: boolean
}

export const FabMenu = ({ showProfileBtn, useAnimation }: FabMenuProps) => {
	const navigate = useNavigate()
	const [isVisible, setIsVisible] = useState(true)
	const lastScrollY = useRef(0)

	useEffect(() => {
		if (!useAnimation) return
		
		const scrollContainer = document.getElementById('root')

		if (!scrollContainer) return

		const handleScroll = () => {
			const currentScrollY = scrollContainer.scrollTop

			if (currentScrollY < 0) return

			if (currentScrollY < 10) {
				setIsVisible(true)
				lastScrollY.current = currentScrollY
				return
			}

			if (Math.abs(currentScrollY - lastScrollY.current) < 5) return

			if (currentScrollY > lastScrollY.current) {
				setIsVisible(false)
			} else {
				setIsVisible(true)
			}

			lastScrollY.current = currentScrollY
		}

		scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			scrollContainer.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 24, // Немного увеличил отступ, чтобы на iPhone с "челкой" снизу не прилипало
				right: 16,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
				zIndex: 100,
				// CSS transition
				transform: isVisible ? 'translateY(0)' : 'translateY(200%)',
				opacity: isVisible ? 1 : 0, // Добавил прозрачность для плавности
				transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
				// Важно: отключаем клики, когда скрыто, чтобы не перекрывать контент под кнопкой
				pointerEvents: isVisible ? 'auto' : 'none',
			}}
		>
			{showProfileBtn && (
				<Button
					mode='bezeled'
					onClick={() => navigate('/profile')}
					style={{
						width: 48,
						height: 48,
						borderRadius: '50%',
						padding: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
						backgroundColor: 'var(--tgui--bg_color)',
						color: 'var(--tgui--text_color)',
					}}
				>
					<User size={24} />
				</Button>
			)}

			<Button
				mode='filled'
				onClick={() => navigate('/create')}
				style={{
					width: 56,
					height: 56,
					borderRadius: '50%',
					padding: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 4px 12px rgba(var(--tgui--button_color_rgb), 0.4)',
				}}
			>
				<Plus size={32} />
			</Button>
		</div>
	)
}

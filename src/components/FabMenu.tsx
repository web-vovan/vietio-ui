import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@telegram-apps/telegram-ui'
import { Plus, User } from 'lucide-react'

export const FabMenu = () => {
	const navigate = useNavigate()

	const [isVisible, setIsVisible] = useState(true)

	const lastScrollY = useRef(0)

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY
			if (currentScrollY < 10) {
				setIsVisible(true)
				lastScrollY.current = currentScrollY
				return
			}

			if (currentScrollY > lastScrollY.current) {
				setIsVisible(false)
			} else {
				setIsVisible(true)
			}

			lastScrollY.current = currentScrollY
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 24,
				right: 16,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
				zIndex: 100,
				transform: isVisible ? 'translateY(0)' : 'translateY(150px)',
				transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
				pointerEvents: isVisible ? 'auto' : 'none',
			}}
		>
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

import { Caption } from '@telegram-apps/telegram-ui'
import { CategoryItem } from '../types'
import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

type CategoriesBarProps = {
	categories: CategoryItem[]
	currentCategoryId: number
	onCategoryChange: (id: number) => void
}

export const CategoriesBar = ({
	categories,
	currentCategoryId,
	onCategoryChange,
}: CategoriesBarProps) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [showFade, setShowFade] = useState(true)
	const itemRefs = useRef<Record<number, HTMLDivElement | null>>({})
	const isFirstRender = useRef(true)

	useEffect(() => {
		if (!isFirstRender.current) return
		isFirstRender.current = false

		if (!scrollRef.current) return

		const selectedEl = itemRefs.current[currentCategoryId]
		if (!selectedEl) return

		selectedEl.scrollIntoView({
			behavior: 'auto',
			inline: 'center',
			block: 'nearest',
		})
	}, [])
	
	// Скрываем градиент, если доскроллили до конца
	const handleScroll = () => {
		if (!scrollRef.current) return
		const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
		// Если осталось меньше 5px до конца, скрываем
		setShowFade(scrollLeft + clientWidth < scrollWidth - 5)
	}
	return (
		<div style={{ position: 'relative' }}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 16,
					width: 60,
					pointerEvents: 'none',
					opacity: showFade ? 1 : 0,
					transition: 'opacity 0.25s ease',
					zIndex: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
					paddingRight: 12,
					background:
						'linear-gradient(to left, var(--tgui--secondary_bg_color), transparent)',
				}}
			>
				<ChevronRight
					size={22}
					style={{
						opacity: 0.5,
						animation: showFade
							? 'slideHint 1.4s ease-in-out infinite'
							: 'none',
					}}
				/>
			</div>
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className='hide-scrollbar'
				style={{
					display: 'flex',
					overflowX: 'auto',
					gap: 12,
					padding: '0 16px 16px 16px',
					scrollbarWidth: 'none',
				}}
			>
				{categories.map(cat => {
					const isSelected = currentCategoryId === cat.id
					const Icon = cat.icon

					return (
						<div
							key={cat.id}
							ref={el => {
								itemRefs.current[cat.id] = el
							}}
							onClick={() => onCategoryChange(cat.id)}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								minWidth: 68,
								cursor: 'pointer',
								opacity: 1,
								transition: 'all 0.2s ease',
							}}
						>
							<div
								style={{
									width: 56,
									height: 56,
									borderRadius: 18,
									background: isSelected
										? 'linear-gradient(135deg, #16a34a 0%, #0ea5e9 100%)' // Фирменный градиент
										: 'var(--tgui--secondary_bg_color)', // Обычный фон
									boxShadow: isSelected
										? '0 4px 12px rgba(14, 165, 233, 0.3)'
										: 'none',

									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									marginBottom: 6,
									transition: 'all 0.2s ease',
								}}
							>
								<Icon
									size={26}
									strokeWidth={2}
									color={isSelected ? '#ffffff' : 'var(--tgui--text_color)'}
									style={{ opacity: isSelected ? 1 : 0.6 }}
								/>
							</div>

							<Caption
								level='2'
								weight={isSelected ? '2' : '3'}
								style={{
									color: isSelected
										? 'var(--tgui--text_color)'
										: 'var(--tgui--hint_color)',
									textAlign: 'center',
									lineHeight: '1.2',
								}}
							>
								{cat.name}
							</Caption>
						</div>
					)
				})}
			</div>
		</div>
	)
}

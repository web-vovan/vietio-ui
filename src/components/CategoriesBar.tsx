import { Caption } from '@telegram-apps/telegram-ui'
import { CategoryItem } from '../types'

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
	return (
		<div
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

				return (
					<div
						key={cat.id}
						onClick={() => onCategoryChange(cat.id)}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							minWidth: 64,
							cursor: 'pointer',
							opacity: isSelected ? 1 : 0.7,
						}}
					>
						<div
							style={{
								width: 50,
								height: 50,
								borderRadius: '50%',
								backgroundColor: isSelected
									? 'var(--tgui--button_color)'
									: 'var(--tgui--secondary_bg_color)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 24,
								marginBottom: 6,
							}}
						>
							{cat.icon}
						</div>

						<Caption
							level='2'
							weight={isSelected ? '2' : '3'}
							style={{
								color: isSelected
									? 'var(--tgui--text_color)'
									: 'var(--tgui--hint_color)',
							}}
						>
							{cat.name}
						</Caption>
					</div>
				)
			})}
		</div>
	)
}

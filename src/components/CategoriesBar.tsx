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
				const Icon = cat.icon

				return (
					<div
						key={cat.id}
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
	)
}

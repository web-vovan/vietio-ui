import { Caption } from '@telegram-apps/telegram-ui'

type CategoriesBarProps = {
	currentCategoryId: number
	onCategoryChange: (id: number) => void
}

const categories = [
	{ id: 0, name: 'Все', icon: '⚡️' },
	{ id: 1, name: 'Авто', icon: '🚗' },
	{ id: 2, name: 'Недвиж.', icon: '🏠' },
	{ id: 3, name: 'Работа', icon: '💼' },
	{ id: 4, name: 'Техника', icon: '📱' },
	{ id: 5, name: 'Одежда', icon: '👕' },
	{ id: 6, name: 'Для дома', icon: '🛋️' },
	{ id: 7, name: 'Услуги', icon: '🛠️' },
]

export const CategoriesBar = ({
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

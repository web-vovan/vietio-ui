// Красивая иконка для пустого состояния
export const EmptySearchIcon = () => (
	<svg
		width='100'
		height='100'
		viewBox='0 0 100 100'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		{/* Фон круга */}
		<circle cx='50' cy='50' r='45' fill='var(--tgui--secondary_bg_color)' />

		{/* Лупа */}
		<path
			d='M45.5 66C56.8218 66 66 56.8218 66 45.5C66 34.1782 56.8218 25 45.5 25C34.1782 25 25 34.1782 25 45.5C25 56.8218 34.1782 66 45.5 66Z'
			stroke='var(--tgui--hint_color)'
			strokeWidth='6'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<path
			d='M60.5 60.5L75 75'
			stroke='var(--tgui--hint_color)'
			strokeWidth='6'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
)

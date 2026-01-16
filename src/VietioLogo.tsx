export const VietioLogo = () => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
		{/* Иконка: Красная шляпа со звездой */}
		<svg
			width='32'
			height='32'
			viewBox='0 0 32 32'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			{/* Тень под шляпой (для объема) */}
			<ellipse
				cx='16'
				cy='26'
				rx='10'
				ry='2'
				fill='var(--tgui--hint_color)'
				fillOpacity='0.3'
			/>

			{/* Сама шляпа (Треугольник со скругленными углами) */}
			<path
				d='M14.268 4.5359C15.0378 3.20257 16.9622 3.20257 17.732 4.5359L29.8564 25.5359C30.6262 26.8692 29.664 28.5359 28.1244 28.5359H3.87564C2.33604 28.5359 1.37379 26.8692 2.14359 25.5359L14.268 4.5359Z'
				fill='#DA251D' // Красный цвет флага Вьетнама
			/>

			{/* Желтая звезда */}
			<path
				d='M16 11L17.1226 14.4549H20.7553L17.8163 16.5902L18.9389 20.0451L16 17.9098L13.0611 20.0451L14.1837 16.5902L11.2447 14.4549H14.8774L16 11Z'
				fill='#FFFF00' // Желтый цвет звезды
			/>
		</svg>

		{/* Текст названия */}
		<span
			style={{
				fontSize: 20,
				fontWeight: 700, // Жирный шрифт как у брендов
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
				color: 'var(--tgui--text_color)', // Цвет меняется в зависимости от темы (темная/светлая)
				letterSpacing: '-0.5px', // Чуть плотнее буквы
			}}
		>
			Вьетио
		</span>
	</div>
)

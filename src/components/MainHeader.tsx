import { FixedLayout, Caption } from '@telegram-apps/telegram-ui'
import { MapPin } from 'lucide-react'
import { VietioLogo } from '../VietioLogo'

export const MainHeader = () => {
	return (
		<FixedLayout
			vertical='top'
			style={{
				padding: '12px 16px',
				background: 'rgba(var(--tgui--bg_color_rgb), 0.9)',
				borderBottom: '1px solid var(--tgui--secondary_bg_color)',
				backdropFilter: 'blur(10px)',
				zIndex: 10,

				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			{/* Логотип / возврат наверх */}
			<div
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				style={{
					display: 'flex',
					alignItems: 'center',
					cursor: 'pointer',
				}}
			>
				<VietioLogo />
			</div>

			{/* Город (контекст) */}
			<div
				onClick={() => console.log('Смена города')}
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 4,
					padding: '6px 10px',
					borderRadius: 16,
					cursor: 'pointer',
					background: 'var(--tgui--secondary_bg_color)',
				}}
			>
				<MapPin size={14} color='var(--tgui--hint_color)' />
				<Caption
					level='1'
					weight='2'
					style={{
						color: 'var(--tgui--text_color)',
						whiteSpace: 'nowrap',
					}}
				>
					Нячанг
				</Caption>
			</div>
		</FixedLayout>
	)
}

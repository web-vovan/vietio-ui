import { FixedLayout, Caption } from '@telegram-apps/telegram-ui'
import { MapPin } from 'lucide-react'
import { VietioLogo } from '../VietioLogo'

export const MainHeader = () => {
	return (
		<FixedLayout
			vertical='top'
			style={{
				padding: '12px 16px',
				background: 'var(--tgui--bg_color)',
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
				zIndex: 10,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
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

			<div
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

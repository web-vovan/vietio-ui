import React from 'react'
import { TreePalm } from 'lucide-react'

export const VietioLogo = () => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<TreePalm size={30} color='#16a34a' strokeWidth={2.5} />
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<span
					style={{
						fontSize: 24,
						fontWeight: 600,
						fontFamily:
							'"SF Pro Rounded", "SF Pro Display", system-ui, sans-serif',
						lineHeight: 1,
						letterSpacing: '-0.5px',

						background: 'linear-gradient(90deg, #16a34a 0%, #0ea5e9 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',

						paddingBottom: 2,
					}}
				>
					vietio
				</span>
			</div>
		</div>
	)
}

import { Button, FixedLayout } from "@telegram-apps/telegram-ui";
import { ChevronLeft, Share2 } from "lucide-react";

import { useNavigate } from 'react-router-dom'

export const AdDetailHeader = () => {
	const navigate = useNavigate() // Для перехода на другие страницы

	return (
		<FixedLayout
			vertical='top'
			style={{
				padding: '12px 16px',
				// Делаем полупрозрачную подложку, чтобы видно было на фоне фото
				backgroundColor: 'var(--tgui--bg_color)',
				borderBottom: '1px solid var(--tgui--secondary_bg_color)',
				zIndex: 50,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Button
				mode='plain'
				size='l'
				onClick={() => navigate(-1)} // Возвращает на предыдущую страницу
				style={{
					padding: 0,
					width: 32,
					height: 32,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<ChevronLeft size={28} color='var(--tgui--link_color)' />
			</Button>

			<div style={{ display: 'flex', gap: 16 }}>
				<Share2
					size={24}
					color='var(--tgui--link_color)'
					style={{ cursor: 'pointer' }}
				/>
			</div>
		</FixedLayout>
	)
}
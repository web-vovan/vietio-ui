import { FixedLayout, IconButton, Text } from "@telegram-apps/telegram-ui";
import { ChevronLeft } from "lucide-react";

import { useNavigate } from 'react-router-dom'

export const AdCreateHeader = () => {
	const navigate = useNavigate() // Для перехода на другие страницы

	return (
		<FixedLayout
			vertical='top'
			style={{
				padding: '12px 16px',
				backgroundColor: 'var(--tgui--bg_color)',
				borderBottom: '1px solid var(--tgui--secondary_bg_color)',
				zIndex: 50,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: 35,
				gap: 12,
			}}
		>
			<IconButton
				mode='plain'
				size='l'
				onClick={() => navigate(-1)}
				style={{
					position: 'absolute',
					left: 16,
					width: 44,
					height: 44,
				}} // Иногда нужно уточнить размеры
			>
				<ChevronLeft size={28} color='var(--tgui--link_color)' />
			</IconButton>

			<Text weight='2' style={{ fontSize: 18 }}>
				Новое объявление
			</Text>
		</FixedLayout>
	)
}
import { Button, FixedLayout, Text } from "@telegram-apps/telegram-ui";
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
				gap: 12,
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

			<Text weight='2' style={{ fontSize: 18 }}>
				Новое объявление
			</Text>
		</FixedLayout>
	)
}
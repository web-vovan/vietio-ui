import { Button, FixedLayout } from "@telegram-apps/telegram-ui";
import { VietioLogo } from "../VietioLogo";

import { useNavigate } from 'react-router-dom'

export const MainHeader = () => {
	const navigate = useNavigate() // Для перехода на другие страницы
	return (
		<FixedLayout
			vertical='top'
			style={{
				padding: '12px 20px',
				backgroundColor: 'var(--tgui--bg_color)',
				borderBottom: '1px solid var(--tgui--secondary_bg_color)',
				zIndex: 50,
				backdropFilter: 'blur(10px)',
				background: 'rgba(var(--tgui--bg_color_rgb), 0.8)',

				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			{/* ВСТАВЛЯЕМ ЛОГОТИП СЮДА ВМЕСТО ТЕКСТА */}
			<VietioLogo />

			{/* ПРАВАЯ ЧАСТЬ (Кнопки остаются те же) */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<Button
					size='s'
					mode='bezeled'
					onClick={() => console.log('Профиль')}
					style={{
						width: 36,
						height: 36,
						padding: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<span style={{ fontSize: 20 }}>👤</span>
				</Button>

				<Button
					size='s'
					mode='filled'
					onClick={() => navigate('/create')}
					style={{
						width: 36,
						height: 36,
						padding: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '50%',
					}}
				>
					<span style={{ fontSize: 24, lineHeight: '24px' }}>+</span>
				</Button>
			</div>
		</FixedLayout>
	)
}
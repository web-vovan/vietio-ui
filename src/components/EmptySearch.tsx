import { Button, Placeholder } from '@telegram-apps/telegram-ui'
import { SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const EmptySearch = () => {
	const navigate = useNavigate()

	return (
		<Placeholder
			
		>
			<div
				style={{
					width: 100,
					height: 100,
					borderRadius: '50%',
					backgroundColor: 'var(--tgui--secondary_bg_color)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 8,
				}}
			>
				<SearchX size={48} color='var(--tgui--hint_color)' strokeWidth={1.5} />
			</div>

			<Button
				size='m'
				mode='filled'
				onClick={() => navigate('/create')}
				style={{ marginTop: 16 }}
			>
				Разместить объявление
			</Button>
		</Placeholder>
	)
}

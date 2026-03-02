import { Button, Placeholder } from '@telegram-apps/telegram-ui'
import { SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Text } from '@telegram-apps/telegram-ui'

export const EmptySearch = () => {
	const navigate = useNavigate()

	return (
		<Placeholder>
			<div style={{ marginBottom: 16 }}>
				<SearchX size={48} color='var(--tgui--hint_color)' />
			</div>

			<Text
				weight='2'
				style={{
					fontSize: 20,
					marginBottom: 8,
					color: 'var(--tgui--hint_color)',
				}}
			>
				Пока нет товаров
			</Text>

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

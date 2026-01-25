import { Button, Placeholder } from "@telegram-apps/telegram-ui";
import { useNavigate } from 'react-router-dom'

type AdDetailErrorProps = {
	error: string
}

export const AdDetailError = ({ error }: AdDetailErrorProps) => {
	const navigate = useNavigate()

	return (
		<Placeholder header='Ошибка' description={error}>
			<Button onClick={() => navigate('/')}>На главную</Button>
		</Placeholder>
	)
}
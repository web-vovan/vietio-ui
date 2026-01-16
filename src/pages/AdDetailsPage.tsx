import React from 'react'
import { Placeholder, Button } from '@telegram-apps/telegram-ui'
import { useParams, useNavigate } from 'react-router-dom'

export const AdDetailsPage = () => {
	const { id } = useParams() // Получаем ID из URL
	const navigate = useNavigate()

	return (
		<Placeholder header={`Товар #${id}`} description='Детальная информация'>
			<Button onClick={() => navigate(-1)}>Назад</Button>
		</Placeholder>
	)
}

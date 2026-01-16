import React from 'react'
import { Placeholder, Button } from '@telegram-apps/telegram-ui'
import { useNavigate } from 'react-router-dom'

export const CreateAdPage = () => {
	const navigate = useNavigate()
	return (
		<Placeholder header='Новое объявление' description='Здесь будет форма'>
			<Button onClick={() => navigate(-1)}>Назад</Button>
		</Placeholder>
	)
}

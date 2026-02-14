import React from 'react'
import { Placeholder, Button } from '@telegram-apps/telegram-ui'
import { useNavigate } from 'react-router-dom'
import { MainHeader } from './MainHeader'

export type ErrorType = 'not_found' | 'bad_request' | 'server_error' | 'forbidden'

type ErrorPlaceholderProps = {
	errorType: ErrorType
	show500Btn?: boolean
	showHeader?: boolean
}

const PageWrapper: React.FC<{
	showHeader?: boolean
	children: React.ReactNode
}> = ({ showHeader, children }) => {
	if (!showHeader) {
		return <>{children}</>
	}

	return (
		<>
			<MainHeader />
			<div style={{ paddingTop: 70, paddingBottom: 40 }}>{children}</div>
		</>
	)
}

export const ErrorPlaceholder = ({
	errorType,
	show500Btn,
	showHeader,
}: ErrorPlaceholderProps) => {
	const navigate = useNavigate()
	const goHome = () => navigate('/', { replace: true })

	const content = (() => {
		if (errorType === 'not_found') {
			return (
				<Placeholder
					header='Объявление не найдено'
					description='Возможно, товар уже продан, объявление было удалено или срок его действия истёк'
				>
					<img
						alt='error'
						src='https://xelene.me/telegram.gif'
						style={{
							width: 100,
							height: 100,
							display: 'block',
							margin: '0 auto 20px',
						}}
					/>
					<Button size='l' stretched onClick={goHome}>
						Смотреть другие объявления
					</Button>
				</Placeholder>
			)
		}

		if (errorType === 'bad_request') {
			return (
				<Placeholder
					header='Неверная ссылка'
					description='Похоже, адрес объявления указан с ошибкой'
				>
					<img
						alt='error'
						src='https://xelene.me/telegram.gif'
						style={{
							width: 100,
							height: 100,
							display: 'block',
							margin: '0 auto 20px',
						}}
					/>
					<Button size='l' stretched onClick={goHome}>
						На главную
					</Button>
				</Placeholder>
			)
		}

		if (errorType === 'forbidden') {
			return (
				<Placeholder
					header='Ой, ошибка'
					description='У вас нет доступа у этой странице'
				>
					<img
						alt='error'
						src='https://xelene.me/telegram.gif'
						style={{
							width: 100,
							height: 100,
							display: 'block',
							margin: '0 auto 20px',
						}}
					/>
					<Button size='l' stretched onClick={goHome}>
						На главную
					</Button>
				</Placeholder>
			)
		}

		return (
			<Placeholder
				header='Ой, ошибка'
				description='Не удалось загрузить данные'
			>
				<img
					alt='error'
					src='https://xelene.me/telegram.gif'
					style={{
						width: 100,
						height: 100,
						display: 'block',
						margin: '0 auto',
					}}
				/>
				{show500Btn && (
					<Button size='l' stretched onClick={goHome}>
						На главную
					</Button>
				)}
			</Placeholder>
		)
	})()

	return <PageWrapper showHeader={showHeader}>{content}</PageWrapper>
}

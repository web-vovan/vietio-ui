import { Placeholder } from "@telegram-apps/telegram-ui";

type EmptySearchProps = {
	error: string
}

export const ErrorSearch = ({ error }: EmptySearchProps) => {
	return (
		<Placeholder header='Ой, ошибка' description={error}>
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
		</Placeholder>
	)
}
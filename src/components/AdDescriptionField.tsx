import { Text, Textarea } from "@telegram-apps/telegram-ui"

type AdDescriptionFieldProps = {
	description: string
	error: boolean
	onChange: (value: string) => void
}

export const AdDescriptionField = ({
	description,
	error,
	onChange,
}: AdDescriptionFieldProps) => {
	return (
		<>
			<Textarea
				header='Описание'
				placeholder='Состояние, особенности...'
				value={description}
				onChange={e => onChange(e.target.value)}
				status={error ? 'error' : 'default'}
			/>
			{error && (
				<Text
					style={{
						color: 'var(--tgui--destructive_text_color)',
						fontSize: 13,
						padding: '0 20px 10px 20px',
						marginTop: -8,
					}}
				>
					Добавьте описание товара
				</Text>
			)}
		</>
	)
}
import { Text, Input } from "@telegram-apps/telegram-ui"

type AdTitleFieldProps = {
	title: string
	error: boolean
	onChange: (value: string) => void
}

export const AdTitleField = ({ title, error, onChange }: AdTitleFieldProps) => {
	return (
		<>
			<Input
				header='Название'
				placeholder='Например, iPhone 15 Pro'
				value={title}
				onChange={e => onChange(e.target.value)}
				// ВАЖНО: Подсветка красным
				status={error ? 'error' : 'default'}
			/>
			{/* Текст ошибки */}
			{error && (
				<Text
					style={{
						color: 'var(--tgui--destructive_text_color)',
						fontSize: 13,
						padding: '0 20px 10px 20px',
						marginTop: -8,
					}}
				>
					Добавьте название товара
				</Text>
			)}
		</>
	)
}
import { Input } from "@telegram-apps/telegram-ui"

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
				value={title}
				onChange={e => onChange(e.target.value)}
				status={error ? 'error' : 'default'}
			/>
		</>
	)
}
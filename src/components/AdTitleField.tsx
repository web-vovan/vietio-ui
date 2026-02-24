import { Input } from "@telegram-apps/telegram-ui"
import { FormField } from "../wrappers/FormField"

type AdTitleFieldProps = {
	title: string
	error: boolean
	onChange: (value: string) => void
}

export const AdTitleField = ({ title, error, onChange }: AdTitleFieldProps) => {
	return (
		<FormField>
			<Input
				header='Название'
				value={title}
				onChange={e => onChange(e.target.value)}
				status={error ? 'error' : 'default'}
			/>
		</FormField>
	)
}
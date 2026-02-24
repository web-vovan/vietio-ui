import { Textarea } from "@telegram-apps/telegram-ui"
import { FormField } from "../wrappers/FormField"

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
		<FormField>
			<Textarea
				header='Описание'
				value={description}
				onChange={e => onChange(e.target.value)}
				status={error ? 'error' : 'default'}
			/>
		</FormField>
	)
}
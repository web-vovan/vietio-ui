import { Textarea } from "@telegram-apps/telegram-ui"

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
				value={description}
				onChange={e => onChange(e.target.value)}
				status={error ? 'error' : 'default'}
			/>
		</>
	)
}
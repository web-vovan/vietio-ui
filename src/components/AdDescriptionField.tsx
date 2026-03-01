import { Caption, Textarea } from "@telegram-apps/telegram-ui"
import { useIsIOS } from '../hooks/useIsIOS'

type AdDescriptionFieldProps = {
	description: string
	error: boolean
	maxLength: number
	onChange: (value: string) => void
}

export const AdDescriptionField = ({
	description,
	error,
	maxLength,
	onChange,
}: AdDescriptionFieldProps) => {
	const isLimitReached = description.length >= maxLength
	const remaining = maxLength - description.length
	const showCounter = remaining <= 100
	const isIOS = useIsIOS()

	return (
		<div>
			<Textarea
				header='Описание'
				value={description}
				placeholder={isIOS ? 'Описание' : undefined}
				onChange={e => onChange(e.target.value)}
				maxLength={maxLength}
				status={error ? 'error' : 'default'}
			/>

			{showCounter && (
				<Caption
					style={{
						display: 'block',
						textAlign: 'right',
						marginTop: 4,
						fontSize: 14,
						padding: '0 20px',
						color: isLimitReached
							? 'var(--tgui--destructive_text_color)'
							: 'var(--tgui--hint_color)',
					}}
				>
					{description.length}/{maxLength}
				</Caption>
			)}
		</div>
	)
}
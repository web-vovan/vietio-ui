import { Caption, Textarea } from "@telegram-apps/telegram-ui"
import { useIsIOS } from '../hooks/useIsIOS'
import { useEffect } from "react"

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

	useEffect(() => {
		if (!isIOS) return

		const textarea = document.querySelector('textarea')

		if (!textarea) return

		const handleFocus = () => {
			setTimeout(() => {
				window.scrollTo(0, document.body.scrollHeight)
			}, 350)
		}

		textarea.addEventListener('focus', handleFocus)

		return () => {
			textarea.removeEventListener('focus', handleFocus)
		}
	}, [isIOS])

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
import { Caption, Input } from '@telegram-apps/telegram-ui'
import { Tag } from 'lucide-react'

type AdTitleFieldProps = {
	title: string
	error: boolean
	onChange: (value: string) => void
	maxLength: number // Добавляем проп для лимита
}

export const AdTitleField = ({
	title,
	error,
	onChange,
	maxLength,
}: AdTitleFieldProps) => {
	const isLimitReached = title.length >= maxLength
	const remaining = maxLength - title.length
	const showCounter = remaining <= 10

	return (
		<Input
			header='Название'
			before={<Tag size={24} color='var(--tgui--hint_color)' />}
			value={title}
			onChange={e => onChange(e.target.value)}
			status={error ? 'error' : 'default'}
			maxLength={maxLength}
			after={showCounter && (
				<Caption
					style={{
						fontSize: 14,
						color: isLimitReached
							? 'var(--tgui--destructive_text_color)'
							: 'var(--tgui--hint_color)',
						paddingLeft: 8,
						whiteSpace: 'nowrap',
					}}
				>
					{title.length}/{maxLength}
				</Caption>
			)}
		/>
	)
}

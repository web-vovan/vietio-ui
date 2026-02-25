import { Input } from '@telegram-apps/telegram-ui'
import { Tag } from 'lucide-react'

type AdTitleFieldProps = {
	title: string
	error: boolean
	onChange: (value: string) => void
}

export const AdTitleField = ({ title, error, onChange }: AdTitleFieldProps) => {
	return (
		<Input
		header='Название'
			before={<Tag size={24} color='var(--tgui--hint_color)' />}
			value={title}
			onChange={e => onChange(e.target.value)}
			status={error ? 'error' : 'default'}
		/>
	)
}

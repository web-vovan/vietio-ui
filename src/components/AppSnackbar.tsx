import { Snackbar } from '@telegram-apps/telegram-ui'
import { CircleCheck, CircleAlert } from 'lucide-react'

export type SnackbarType = 'success' | 'error'

export type AppSnackbarProps = {
	open: boolean
	type: SnackbarType
	title: string
	description?: string
	onClose: () => void
}

export const AppSnackbar = ({
	open,
	type,
	title,
	description,
	onClose,
}: AppSnackbarProps) => {
	if (!open) return null

	const icon =
		type === 'success' ? (
			<CircleCheck size={28} color='#34C759' />
		) : (
			<CircleAlert size={28} color='#FF3B30' />
		)

	return (
		<Snackbar
			onClose={onClose}
			before={icon}
			description={description}
			style={{ zIndex: 100, marginBottom: 80 }}
		>
			{title}
		</Snackbar>
	)
}

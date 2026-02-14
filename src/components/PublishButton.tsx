import { Button, FixedLayout } from "@telegram-apps/telegram-ui"

type PublishButtonProps = {
	loading: boolean
	btnText: string
	onClick: () => void
}

export const PublishButton = ({ btnText, onClick, loading }: PublishButtonProps) => {
	return (
		<FixedLayout
			vertical='bottom'
			style={{
				padding: 16,
				backgroundColor: 'var(--tgui--bg_color)',
				borderTop: '1px solid var(--tgui--secondary_bg_color)',
			}}
		>
			<Button
				size='l'
				stretched
				onClick={onClick}
				loading={loading}
				disabled={loading}
			>
				{btnText}
			</Button>
		</FixedLayout>
	)
}
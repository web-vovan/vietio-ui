import { Spinner } from "@telegram-apps/telegram-ui";

export const AdDetailLoader = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<Spinner size='l' />
		</div>
	)
}
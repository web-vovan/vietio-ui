import { Spinner } from "@telegram-apps/telegram-ui";

type LoaderProps = {
	size: 's' | 'm' | 'l'
}

export const Loader = ({ size }: LoaderProps) => {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
			<Spinner size={size} />
		</div>
	)
}
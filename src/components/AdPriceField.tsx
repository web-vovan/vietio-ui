import { Text, Input } from "@telegram-apps/telegram-ui"
import { Coins } from "lucide-react"

type AdPriceFieldProps = {
	price: string
	onChange: (value: string) => void
}

const formatPriceInput = (value: string) => {
	const number = value.replace(/\D/g, '')

	if (number === '') return ''

	return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const AdPriceField = ({ price, onChange }: AdPriceFieldProps) => {
	return (
		<Input
			header='Цена'
			before={<Coins size={24} color='var(--tgui--hint_color)' />}
			placeholder='0'
			type='text'
			inputMode='numeric'
			value={price}
			onChange={e => onChange(formatPriceInput(e.target.value))}
			after={<Text style={{ color: 'var(--tgui--hint_color)' }}>₫</Text>}
		/>
	)
}
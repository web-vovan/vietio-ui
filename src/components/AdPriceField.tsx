import { Text, Input } from "@telegram-apps/telegram-ui"
import { FormField } from "../wrappers/FormField"

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
		<FormField>
			<Input
				header='Цена'
				placeholder='0'
				type='text'
				inputMode='numeric'
				value={price}
				onChange={e => onChange(formatPriceInput(e.target.value))}
				after={<Text style={{ color: 'var(--tgui--hint_color)' }}>₫</Text>}
			/>
		</FormField>
	)
}
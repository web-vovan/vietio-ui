import React from 'react'
import { Select } from '@telegram-apps/telegram-ui'

export const CitySelect = () => {
	return (
		<Select
			header='Город'
			disabled
			value='1'
		>
			<option value='1'>Нячанг</option>
		</Select>
	)
}

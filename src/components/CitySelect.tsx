import React from 'react'
import { Select } from '@telegram-apps/telegram-ui'
import { FormField } from '../wrappers/FormField'

export const CitySelect = () => {
	return (
		<FormField>
			<Select header='Город' disabled value='1'>
				<option value='1'>Нячанг</option>
			</Select>
		</FormField>
	)
}

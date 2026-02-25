import React from 'react'
import { Select } from '@telegram-apps/telegram-ui'
import { MapPin } from 'lucide-react'

export const CitySelect = () => {
	return (
		<Select
			header='Город'
			before={
				<div
					style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}
				>
					<MapPin size={24} color='var(--tgui--hint_color)' />
				</div>
			}
			disabled
			value='1'
		>
			<option value='1'>Нячанг</option>
		</Select>
	)
}

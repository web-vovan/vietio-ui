import { Select } from '@telegram-apps/telegram-ui'
import { CategoryItem } from '../types'
import { FormField } from '../wrappers/FormField'

type CategoriesBarProps = {
	categories: CategoryItem[]
	currentCategoryId: number
	onCategoryChange: (id: number) => void
}

export const CategoriesSelect = ({
	categories,
	currentCategoryId,
	onCategoryChange,
}: CategoriesBarProps) => {
	return (
		<FormField>
			<Select
				header='Категория'
				value={currentCategoryId}
				onChange={e => onCategoryChange(Number(e.target.value))}
			>
				{categories.map(c => (
					<option key={c.id} value={c.id}>
						{c.name}
					</option>
				))}
			</Select>
		</FormField>
	)
}

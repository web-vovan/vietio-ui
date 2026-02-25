import { Select } from '@telegram-apps/telegram-ui'
import { CategoryItem } from '../types'
import { LayoutGrid } from 'lucide-react'

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
		<Select
			header='Категория'
			before={
				<div
					style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}
				>
					<LayoutGrid size={24} color='var(--tgui--hint_color)' />
				</div>
			}
			value={currentCategoryId}
			onChange={e => onCategoryChange(Number(e.target.value))}
		>
			{categories.map(c => (
				<option key={c.id} value={c.id}>
					{c.name}
				</option>
			))}
		</Select>
	)
}

import { Caption } from '@telegram-apps/telegram-ui'
import { ChevronDown } from 'lucide-react'

type CounterAndSortProps = {
	isLoading: boolean
	totalCount: number
	currentSort: string
	handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const sortLabels: Record<string, string> = {
	date_desc: 'Сначала новые',
	price_asc: 'Дешевле',
	price_desc: 'Дороже',
}

export const CounterAndSort = ({
	isLoading,
	totalCount,
	currentSort,
	handleSortChange,
}: CounterAndSortProps) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '0 16px 12px 16px',
				margin: '5px 0 2px 0',
			}}
		>
			<Caption
				level='1'
				weight='3'
				style={{ color: 'var(--tgui--hint_color)' }}
			>
				{!isLoading ? `Найдено: ${totalCount}` : ''}
			</Caption>

			<div
				style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						color: 'var(--tgui--link_color)',
					}}
				>
					<Caption level='1' weight='2' style={{ color: 'inherit' }}>
						{sortLabels[currentSort]}
					</Caption>
					<ChevronDown size={16} strokeWidth={2.5} />
				</div>

				<select
					value={currentSort}
					onChange={handleSortChange}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						opacity: 0,
						appearance: 'none',
						cursor: 'pointer',
					}}
				>
					<option value='date_desc'>Сначала новые</option>
					<option value='price_asc'>Дешевле</option>
					<option value='price_desc'>Дороже</option>
				</select>
			</div>
		</div>
	)
}

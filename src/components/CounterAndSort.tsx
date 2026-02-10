import { Caption, Select } from "@telegram-apps/telegram-ui";

type CounterAndSortProps = {
	isLoading: boolean
	totalCount: number
	currentSort: string
	handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
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
				padding: '0 0px 12px 16px',
			}}
		>
			<Caption
				level='1'
				weight='3'
				style={{ color: 'var(--tgui--hint_color)' }}
			>
				{!isLoading ? `Найдено: ${totalCount}` : ''}
			</Caption>

			<div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
				<div style={{ width: 'auto', minWidth: 220 }}>
					{' '}
					<Select value={currentSort} onChange={handleSortChange}>
						<option value='date_desc'>Сначала новые</option>
						<option value='price_asc'>Дешевле</option>
						<option value='price_desc'>Дороже</option>
					</Select>
				</div>
			</div>
		</div>
	)
}
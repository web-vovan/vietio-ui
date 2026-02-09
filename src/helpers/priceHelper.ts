export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(price)
}

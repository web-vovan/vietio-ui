export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(price)
}

export const formatDate = (dateString?: string) => {
	if (!dateString) return ''
	return new Date(dateString).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

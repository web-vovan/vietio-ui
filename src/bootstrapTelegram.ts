let bootstrapPromise: Promise<void> | null = null

export const bootstrapTelegram = () => {
	if (bootstrapPromise) return bootstrapPromise

	bootstrapPromise = (async () => {
		const win = window as any

		// === PROD: настоящий Telegram ===
		if (win.Telegram?.WebApp?.initData) {
			return
		}

		// === DEV: мок ===
		if (process.env.NODE_ENV === 'development') {
		const { setupTelegramInitDataMock } =
			await import('./mock/mockTelegramInitData')
		await setupTelegramInitDataMock()
		return
		}

		throw new Error('Telegram WebApp initData not found')
	})()

	return bootstrapPromise
}

export const setupTelegramInitDataMock = async () => {
	// Приводим window к any, чтобы проверить наличие Telegram
	const win = window as any

    const STORAGE_KEY = 'tg_debug_username'
    const DEFAULT_USER = 'web_vovan'

	if (
		process.env.NODE_ENV === 'development' &&
		!win.Telegram?.WebApp?.initData
	) {
		try {
			let username = localStorage.getItem(STORAGE_KEY)

			username = username ?? DEFAULT_USER
			const res = await fetch(`/api/test-init-data/${username}`)
			const responseBody = await res.json()

			win.Telegram = {
				WebApp: {
					initData: responseBody.init_data,
					initDataUnsafe: {
						query_id: 'AAF4...',
						user: {
							id: 123456789,
							first_name: 'Test',
							last_name: 'User',
							username: username || undefined,
							language_code: 'ru',
							allows_write_to_pm: true,
						},
						auth_date: Math.floor(Date.now() / 1000),
						hash: 'mock_hash_string',
					},
					version: '6.0',
					platform: 'tdesktop',
					colorScheme: 'light',
					themeParams: {
						bg_color: '#ffffff',
						text_color: '#000000',
						hint_color: '#000000',
						link_color: '#2481cc',
						button_color: '#2481cc',
						button_text_color: '#ffffff',
						secondary_bg_color: '#f0f0f0',
					},
					isExpanded: true,
					viewportHeight: 600,
					viewportStableHeight: 600,

					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					onEvent: (eventType: string, callback: () => void) => {
						console.log(`[Mock] Subscribed to event: ${eventType}`)
					},
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					offEvent: (eventType: string, callback: () => void) => {
						console.log(`[Mock] Unsubscribed from event: ${eventType}`)
					},
					sendData: (data: any) => {
						console.log(`[Mock] sendData:`, data)
					},
					// ============================

					ready: () => console.log('[Mock] WebApp.ready()'),
					expand: () => console.log('[Mock] WebApp.expand()'),
					close: () => console.log('[Mock] WebApp.close()'),
					MainButton: {
						text: 'MAIN BUTTON',
						color: '#2481cc',
						textColor: '#ffffff',
						isVisible: false,
						isActive: true,
						isProgressVisible: false,
						setText: function (text: string) {
							this.text = text
							console.log('[Mock] MainButton setText:', text)
						},
						onClick: () => {},
						offClick: () => {},
						show: () => console.log('[Mock] MainButton show'),
						hide: () => console.log('[Mock] MainButton hide'),
						enable: () => console.log('[Mock] MainButton enable'),
						disable: () => console.log('[Mock] MainButton disable'),
					},
					BackButton: {
						isVisible: false,
						onClick: () => {},
						offClick: () => {},
						show: () => console.log('[Mock] BackButton show'),
						hide: () => console.log('[Mock] BackButton hide'),
					},
					HapticFeedback: {
						impactOccurred: () => console.log('[Mock] Haptic impact'),
						notificationOccurred: () =>
							console.log('[Mock] Haptic notification'),
						selectionChanged: () => console.log('[Mock] Haptic selection'),
					},
				},
			}
			console.log('Test initData injected via API')
		} catch (e) {
			console.error('Failed to inject mock data', e)
		}
	}
}

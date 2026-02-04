const getJwtToken = async (): Promise<string> => {
	// @ts-ignore
	const init_data = window.Telegram?.WebApp?.initData

	if (!init_data) {
		throw new Error('Запуск вне Telegram')
	}

	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ init_data }),
	})

	if (!response.ok) {
		throw new Error('Ошибка авторизации')
	}

	const data = await response.json()
	localStorage.setItem('jwt_token', data.token)
	return data.token
}

export const apiClient = async (url: string, options: RequestInit = {}) => {
	let token = localStorage.getItem('jwt_token')

	if (!token) {
		try {
			token = await getJwtToken()
		} catch (e) {
			console.error(e)
			throw e
		}
	}

	const isFormData = options.body instanceof FormData

	const extraHeaders =
		(options.headers as Record<string, string> | undefined) ?? {}

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		...extraHeaders,
	}

	if (!isFormData && !headers['Content-Type']) {
		headers['Content-Type'] = 'application/json'
	}

	let response = await fetch(url, {
		...options,
		headers,
	})

	if (response.status === 401) {
		try {
			token = await getJwtToken()

			const newHeaders = {
				...headers,
				Authorization: `Bearer ${token}`,
			}

			response = await fetch(url, { ...options, headers: newHeaders })
		} catch (e) {
			localStorage.removeItem('jwt_token')
			throw e
		}
	}

	return response
}

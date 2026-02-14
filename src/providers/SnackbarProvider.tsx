import React, { createContext, useContext, useState } from 'react'
import { AppSnackbar, SnackbarType } from '../components/AppSnackbar'

type SnackbarContextType = {
	showSnackbar: (
		type: SnackbarType,
		title: string,
		description?: string,
	) => void
}

const SnackbarContext = createContext<SnackbarContextType | null>(null)

export const SnackbarProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [snackbar, setSnackbar] = useState({
		open: false,
		type: 'success' as SnackbarType,
		title: '',
		description: '',
	})

	const showSnackbar = (
		type: SnackbarType,
		title: string,
		description?: string,
	) => {
		setSnackbar({
			open: true,
			type,
			title,
			description: description || '',
		})
	}

	const handleClose = () => {
		setSnackbar(prev => ({ ...prev, open: false }))
	}

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}

			<AppSnackbar
				open={snackbar.open}
				type={snackbar.type}
				title={snackbar.title}
				description={snackbar.description}
				onClose={handleClose}
			/>
		</SnackbarContext.Provider>
	)
}

export const useSnackbar = () => {
	const context = useContext(SnackbarContext)

	if (!context) {
		throw new Error('useSnackbar must be used within SnackbarProvider')
	}

	return context
}

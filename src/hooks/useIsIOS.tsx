export const useIsIOS = () => {
	return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

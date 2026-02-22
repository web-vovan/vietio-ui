import { FixedLayout, IconButton } from '@telegram-apps/telegram-ui'
import { ChevronLeft, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BOT_USERNAME = 'vietio_bot'; // Имя бота без @
const APP_NAME = 'app';            // Short name приложения из BotFather

interface AdDetailHeaderProps {
	uuid?: string
	title?: string
}

export const AdDetailHeader = ({ uuid, title }: AdDetailHeaderProps) => {
	const navigate = useNavigate()

	const handleShare = () => {
		if (!uuid) return

		const appLink = `https://t.me/${BOT_USERNAME}/${APP_NAME}?startapp=${uuid}`

		const messageText = title
			? `Посмотри это объявление в Нячанге: "${title}"`
			: 'Классное объявление во Вьетнаме!'

		const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent(messageText)}`

		if (window.Telegram?.WebApp?.openTelegramLink) {
			window.Telegram.WebApp.openTelegramLink(shareUrl)
		} else {
			window.open(shareUrl, '_blank')
		}
	}

	const handleBack = () => {
		if (window.history.length <= 1) {
			navigate('/')
		} else {
			navigate(-1)
		}
	}

	return (
		<FixedLayout
			vertical='top'
			style={{
				padding: '8px 16px',
				backgroundColor: 'var(--tgui--bg_color)',
				borderBottom: '1px solid var(--tgui--secondary_bg_color)',
				zIndex: 50,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: 'calc(8px + env(safe-area-inset-top))',
			}}
		>
			<IconButton
				mode='plain'
				size='l'
				onClick={handleBack}
				style={{ width: 44, height: 44 }} // Иногда нужно уточнить размеры
			>
				<ChevronLeft size={28} color='var(--tgui--link_color)' />
			</IconButton>

			<div style={{ display: 'flex', gap: 16 }}>
				<IconButton
					mode='plain'
					size='l'
					onClick={handleShare}
					disabled={!uuid}
					style={{ width: 44, height: 44 }}
				>
					<Share2 size={24} color='var(--tgui--link_color)' />
				</IconButton>
			</div>
		</FixedLayout>
	)
}

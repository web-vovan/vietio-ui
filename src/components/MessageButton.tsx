import { Button } from "@telegram-apps/telegram-ui"

type Props = {
    username: string
}

export const MessageButton = ({username}: Props) => {
    const handleClick = () => {
        const url = `https://t.me/${username}`

        if (window.Telegram?.WebApp?.openTelegramLink) {
            window.Telegram.WebApp.openTelegramLink(url)
        } else {
            window.open(url, '_blank')
        }
    }

    return (
        <Button size='l' mode='filled' stretched onClick={handleClick}>
            Написать
        </Button>
    )
}
import { Button, FixedLayout } from "@telegram-apps/telegram-ui"

type PublishButtonProps = {
    onClick: () => void
}

export const PublishButton = ({onClick}: PublishButtonProps) => {
    return (
        <FixedLayout
            vertical='bottom'
            style={{
                padding: 16,
                backgroundColor: 'var(--tgui--bg_color)',
                borderTop: '1px solid var(--tgui--secondary_bg_color)',
            }}
        >
            <Button
                size='l'
                stretched // Растягивает кнопку на всю ширину
                onClick={onClick}
            >
                Опубликовать
            </Button>
        </FixedLayout>
    )
}
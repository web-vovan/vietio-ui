import { Button } from "@telegram-apps/telegram-ui"

export const MessageButton = () => {
    return (
        // <FixedLayout
        //     vertical='bottom'
        //     style={{
        //         padding: 16,
        //         background: 'var(--tgui--bg_color)',
        //         borderTop: '1px solid var(--tgui--secondary_bg_color)',
        //     }}
        // >
            <Button
                size='l'
                mode='filled'
                stretched
                onClick={() => console.log('Чат пока не подключен')}
            >
                Написать
            </Button>
        // </FixedLayout>
    )
}
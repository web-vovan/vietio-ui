import { Button, Placeholder } from "@telegram-apps/telegram-ui";
import { EmptySearchIcon } from "../EmptySearchIcon";
import { useNavigate } from 'react-router-dom'

export const EmptySearch = () => {
    const navigate = useNavigate() // Для перехода на другие страницы

    return (
        <Placeholder
            header='Здесь пока пусто'
            description='В этой категории еще нет объявлений'
        >
            {/* Наша новая иконка */}
            <EmptySearchIcon />

            {/* Кнопка действия (опционально, но полезно для конверсии) */}
            <Button
                size='m'
                mode='filled'
                onClick={() => navigate('/create')}
                style={{ marginTop: 16 }}
            >
                Разместить объявление
            </Button>
        </Placeholder>
    )
}
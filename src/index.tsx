import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setBackgroundAsSecondary } from './helpers/setBackgroundAsSecondary';
import { bootstrapTelegram } from './bootstrapTelegram';

setBackgroundAsSecondary();

const root = createRoot(document.getElementById('root') as HTMLElement)

bootstrapTelegram()
	.then(() => {
		root.render(<App />)
	})
	.catch(err => {
		console.error(err)
		// можно отрендерить fallback
	})

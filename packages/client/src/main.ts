import { createRoot } from 'react-dom/client'

import { router } from './routes'
import './globals.css'

createRoot(document.querySelector('#root')!).render(router)

const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
// eslint-disable-next-line no-console
console.info(
  `%c 🔨 Next Devtools %c Press Shift + ${isMac ? 'Option' : 'Alt'} + D to open NextDevTools %c`,
  'background:#ffc799; padding: 2px 1px; color: #000',
  'background:#000; padding: 2px 1px; color: #FFF',
  'background:transparent',
)

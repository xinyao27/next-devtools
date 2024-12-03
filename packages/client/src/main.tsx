import { createRoot } from 'react-dom/client'
import { router } from './routes'
import './globals.css'

createRoot(document.querySelector('#root')!).render(router)

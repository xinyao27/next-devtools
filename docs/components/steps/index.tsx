import { type ReactNode } from 'react'
import styles from './styles.module.css'

interface Props {
  children: ReactNode
}

export default function Steps({ children }: Props) {
  return <div className={styles.root}>{children}</div>
}

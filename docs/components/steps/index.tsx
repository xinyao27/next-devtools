import styles from './styles.module.css'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Steps({ children }: Props) {
  return <div className={styles.root}>{children}</div>
}

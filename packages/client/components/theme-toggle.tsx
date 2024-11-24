'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  function handleToggleTheme() {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

  return (
    <Button className="opacity-50 transition hover:opacity-100" size="icon" variant="ghost" onClick={handleToggleTheme}>
      <i className="i-ri-sun-line size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <i className="i-ri-moon-line absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

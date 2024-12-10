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
    <Button size="sm" variant="outline" onClick={handleToggleTheme}>
      {theme === 'dark' ? <i className="i-ri-sun-line size-5" /> : <i className="i-ri-moon-line size-5" />}
      <span className="ml-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </Button>
  )
}

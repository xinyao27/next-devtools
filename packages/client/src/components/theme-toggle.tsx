'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  function handleToggleTheme() {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

  return (
    <Button
      onClick={handleToggleTheme}
      size="sm"
      variant="outline"
    >
      {theme === 'dark' ? (
        <i className="i-ri-sun-line size-5 flex-none" />
      ) : (
        <i className="i-ri-moon-line size-5 flex-none" />
      )}
      <span className="ml-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </Button>
  )
}

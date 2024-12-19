import React from 'react'
import { NextDevtoolsContext } from '@next-devtools/shared/context'

export function useNextDevtoolsContent() {
  return React.useContext(NextDevtoolsContext)
}

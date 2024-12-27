import React from 'react'
import { createFrameMessageClient } from '@next-devtools/shared/utils'
import type { FrameMessageHandler } from '@next-devtools/shared/utils'

export function useNextDevtoolsContent() {
  const ref = React.useRef(createFrameMessageClient<FrameMessageHandler>())
  return ref.current
}

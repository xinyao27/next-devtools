import type { FrameMessageHandler } from '@next-devtools/shared/utils'

import { createFrameMessageClient } from '@next-devtools/shared/utils'
import React from 'react'

export function useNextDevtoolsContent() {
  const ref = React.useRef(createFrameMessageClient<FrameMessageHandler>())
  return ref.current
}

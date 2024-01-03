import { createFrameMessageClient, createRPCClient } from '@next-devtools/shared'
import { type FrameMessageHandler } from '@next-devtools/shared'

export const rpcClient = createRPCClient()

export const messageClient = createFrameMessageClient<FrameMessageHandler>()

import type { Route } from '@next-devtools/shared/types'
import type { Node, NodeProps } from '@xyflow/react'

import { Handle, Position } from '@xyflow/react'
import React from 'react'

import OpenInEditor from '@/components/open-in-editor'

export type TreeNodeType = Node<Route & { [key: string]: any }, 'tree'>

export const TreeNode = React.memo(({ data }: NodeProps<TreeNodeType>) => {
  const contents = React.useMemo(() => {
    if (!data || !data.contents || data.contents.length === 0) return null

    return (
      <>
        {data.contents.map((content) => {
          const path = `${data.path}/${content}`
          return (
            <OpenInEditor
              className="flex items-center gap-2"
              key={content}
              value={path}
            >
              <div>{content}</div>
            </OpenInEditor>
          )
        })}
      </>
    )
  }, [data.contents])

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4">
          <span className="font-medium">{data.name}</span>
        </div>
        {contents ? <div className="text-muted-foreground px-4 text-sm">{contents}</div> : null}
        <div className="text-muted-foreground px-4 text-sm capitalize">{data.render}</div>
      </div>

      <Handle
        position={Position.Top}
        type="target"
      />
      <Handle
        position={Position.Bottom}
        type="source"
      />
    </div>
  )
})

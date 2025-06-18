import type { Route } from '@next-devtools/shared/types'
import type { Edge } from '@xyflow/react'
import type { ElkNode } from 'elkjs/lib/elk.bundled.js'

import { MiniMap, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import ELK from 'elkjs/lib/elk.bundled.js'
import React from 'react'
import { useLatest } from 'react-use'

import type { TreeNodeType } from './flow-node'

import { FlowControls } from './flow-controls'
import { TreeNode } from './flow-node'

import '@xyflow/react/dist/style.css'

import './flow-routes.css'

const getLayoutedElements = async (
  nodes: Array<TreeNodeType>,
  edges: Array<Edge>,
  options: ElkNode['layoutOptions'],
): Promise<{ edges: Array<Edge>; nodes: Array<TreeNodeType> }> => {
  const elk = new ELK()
  const isRight = options?.['elk.direction'] === 'RIGHT'
  const isLeft = options?.['elk.direction'] === 'LEFT'
  const isUp = options?.['elk.direction'] === 'UP'
  const targetPosition = isRight ? 'left' : isLeft ? 'right' : isUp ? 'bottom' : 'top'
  const sourcePosition = isRight ? 'right' : isLeft ? 'left' : isUp ? 'top' : 'bottom'

  const graph: ElkNode = {
    children: nodes.map((node) => {
      return {
        ...node,
        'elk.position': {
          x: node.position.x,
          y: node.position.y,
        },
        height: node.measured?.height ?? 100,
        width: node.measured?.width ?? 120,
      }
    }),
    edges: edges.map((edge) => ({
      ...edge,
      sources: [edge.source],
      targets: [edge.target],
    })),
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': '150',
      'elk.spacing.nodeNode': '80',
      ...options,
    },
  }

  const layout = await elk.layout(graph)
  if (!layout || !layout.children) {
    return {
      edges: [],
      nodes: [],
    }
  }
  return {
    edges: (layout.edges ?? []).map((edge) => {
      const initialEdge = edges.find((e) => e.id === edge.id)
      if (!initialEdge) {
        throw new Error('Edge not found')
      }
      return {
        ...initialEdge,
        source: edge.sources[0],
        target: edge.targets[0],
      }
    }) as Edge[],
    nodes: layout.children.map((node) => {
      const initialNode = nodes.find((n) => n.id === node.id)
      if (!initialNode) {
        throw new Error('Node not found')
      }
      return {
        ...initialNode,
        position: {
          x: node.x,
          y: node.y,
        },
        sourcePosition,
        targetPosition,
      }
    }) as TreeNodeType[],
  }
}

interface Props {
  data?: Route[]
}
const nodeTypes = { tree: TreeNode }
export default function FlowRoutes({ data }: Props) {
  if (!data) return null

  return (
    <ReactFlowProvider>
      <Flow data={data} />
    </ReactFlowProvider>
  )
}

function Flow({ data }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const initialNodes = React.useMemo(() => {
    return data?.map(
      (route) =>
        ({
          data: route,
          id: route.id.toString(),
          position: { x: 0, y: 0 },
          type: 'tree',
        }) as TreeNodeType,
    )
  }, [data])
  const initialEdges = React.useMemo(() => {
    return data
      ?.map(
        (route) =>
          ({
            animated: true,
            id: `${route.parentNode}-${route.id}`,
            source: route.parentNode?.toString() ?? '0',
            target: route.id.toString(),
          }) as Edge,
      )
      .filter((edge) => edge.target !== '0')
  }, [data])
  const [nodes, setNodes, onNodesChange] = useNodesState<TreeNodeType>(initialNodes ?? [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? [])
  const latestNodes = useLatest(nodes)
  const latestEdges = useLatest(edges)
  const [loading, setLoading] = React.useState(false)
  const { fitView } = useReactFlow()

  const onLayout = React.useCallback(async () => {
    const { edges: layoutedEdges, nodes: layoutedNodes } = await getLayoutedElements(
      latestNodes.current,
      latestEdges.current,
      {
        'elk.direction': 'DOWN',
      },
    )
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    requestAnimationFrame(() => fitView())
  }, [])

  React.useLayoutEffect(() => {
    setLoading(true)
    onLayout()
    setTimeout(() => {
      onLayout().finally(() => {
        setLoading(false)
      })
    }, 200)
  }, [])

  return (
    <div
      className="relative min-h-[800px] w-full flex-1 rounded-sm"
      ref={containerRef}
    >
      {loading ? (
        <div className="bg-secondary/70 absolute inset-0 z-10 flex items-center justify-center backdrop-blur">
          <i className="i-ri-loader-2-line text-muted-foreground size-6 animate-spin" />
        </div>
      ) : null}
      <ReactFlow
        deleteKeyCode={null}
        edges={edges}
        minZoom={0.1}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      >
        <MiniMap
          pannable
          position="bottom-left"
          zoomable
        />
        <FlowControls
          containerRef={containerRef}
          onLayout={onLayout}
        />
      </ReactFlow>
    </div>
  )
}

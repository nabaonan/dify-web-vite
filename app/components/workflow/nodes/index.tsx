import {
  memo,
  useMemo,
} from 'react'
import type { NodeProps } from 'reactflow'
import type { Node } from '../types'
import { CUSTOM_NODE } from '../constants'
import {
  NodeComponentMap,
  PanelComponentMap,
} from './constants'
import BaseNode from './_base/node'
import BasePanel from './_base/components/workflow-panel'

const CustomNode = (props: NodeProps) => {
  const nodeData = props.data
  const NodeComponent = useMemo(() => NodeComponentMap[nodeData.type], [nodeData.type])

  if (!NodeComponent) {
    console.warn(`[Workflow] Unknown node type: ${nodeData.type}, falling back to placeholder`)
    return (
      <BaseNode
        id={props.id}
        data={props.data}
      >
        <div className="flex items-center justify-center h-full text-xs text-text-tertiary">
          Unknown: {nodeData.type}
        </div>
      </BaseNode>
    )
  }

  return (
    <>
      <BaseNode
        id={props.id}
        data={props.data}
      >
        <NodeComponent />
      </BaseNode>
    </>
  )
}
CustomNode.displayName = 'CustomNode'

export type PanelProps = {
  type: Node['type']
  id: Node['id']
  data: Node['data']
}
export const Panel = memo((props: PanelProps) => {
  const nodeClass = props.type
  const nodeData = props.data
  const PanelComponent = useMemo(() => {
    if (nodeClass === CUSTOM_NODE)
      return PanelComponentMap[nodeData.type]

    return () => null
  }, [nodeClass, nodeData.type])

  if (nodeClass === CUSTOM_NODE) {
    return (
      <BasePanel
        key={props.id}
        id={props.id}
        data={props.data}
      >
        <PanelComponent />
      </BasePanel>
    )
  }

  return null
})

Panel.displayName = 'Panel'

export default memo(CustomNode)

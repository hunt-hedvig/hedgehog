import { useDrag } from '@visx/drag'
import { DefaultLink, DefaultNode, Graph } from '@visx/network'
import React, { useState } from 'react'

export const ClaimTypeTree: React.FC<{}> = ({}) => {
  const [nodes] = useState([
    { x: 0, y: 0 },
    { x: 50, y: 20 },
    { x: 200, y: 300 },
    { x: 300, y: 40 },
  ])

  const [position, setPosition] = useState({ x: 0, y: 0 })

  const onDragMove = (currDrag) => {
    setPosition(() => ({
      x: currDrag.x - currDrag.dx,
      y: currDrag.y - currDrag.dy,
    }))
  }

  const { isDragging, dragStart, dragEnd, dragMove } = useDrag({
    onDragMove,
    resetOnStart: true,
  })

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`${position.x} ${position.y} 1000 1000`}
      style={{ borderRadius: '8px' }}
      onMouseDown={dragStart}
      onMouseUp={isDragging ? dragEnd : undefined}
      onMouseMove={isDragging ? dragMove : undefined}
      onTouchStart={dragStart}
      onTouchEnd={isDragging ? dragEnd : undefined}
      onTouchMove={isDragging ? dragMove : undefined}
    >
      <Graph
        graph={{
          nodes,
          links: [
            { source: nodes[0], target: nodes[1] },
            { source: nodes[1], target: nodes[2] },
            { source: nodes[2], target: nodes[0] },
          ],
        }}
        linkComponent={DefaultLink}
        nodeComponent={DefaultNode}
      />
    </svg>
  )
}

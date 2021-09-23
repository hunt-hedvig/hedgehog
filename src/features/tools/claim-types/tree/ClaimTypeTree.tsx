import { useDrag } from '@visx/drag'
import { DefaultLink, DefaultNode, Graph } from '@visx/network'
import React, { useState } from 'react'

const data = [
  {
    claimType: 'AccidentalDamage',
    properties: [
      {
        id: 'p1',
        name: 'Property One',
        options: [{ id: 'o1', name: 'Option 1' }],
      },
    ],
  },
  {
    claimType: 'Theft',
    properties: [
      {
        id: 'p1',
        name: 'Property One',
        options: [{ id: 'o1', name: 'Option 1' }],
      },
      {
        id: 'p2',
        name: 'Property One',
        options: [{ id: 'o1', name: 'Option 1' }],
      },
    ],
  },
]

interface NodeLinkMapEntry {
  source: string
  target: string
}

interface Node {
  x: number
  y: number
}

const nodeSpacing = 100

const idLinks: NodeLinkMapEntry[] = []
const nodeMap: Record<string, Node> = {}

data.forEach((type, typeIndex) => {
  const typeNode = {
    x: typeIndex * nodeSpacing,
    y: nodeSpacing,
  }

  type.properties.forEach((property, propertyIndex) => {
    property.options.forEach((option, optionIndex) => {
      if (!nodeMap[option.id]) {
        nodeMap[option.id] = {
          x:
            typeIndex * nodeSpacing +
            propertyIndex * nodeSpacing +
            optionIndex * nodeSpacing,
          y: 3 * nodeSpacing,
        }
      }
      idLinks.push({ source: option.id, target: property.id })
    })

    if (!nodeMap[property.id]) {
      nodeMap[property.id] = {
        x: nodeSpacing * typeIndex + propertyIndex * nodeSpacing,
        y: 2 * nodeSpacing,
      }
    }
    idLinks.push({ source: property.id, target: type.claimType })
  })

  nodeMap[type.claimType] = typeNode
})

export const ClaimTypeTree: React.FC<{}> = ({}) => {
  const [nodes] = useState(Object.keys(nodeMap).map((id) => nodeMap[id]))
  const [links] = useState(
    idLinks
      .reduce((acc, { source, target }) => {
        if (
          !acc.find(({ source: existingSource, target: existingTarget }) => {
            return (
              (source === existingSource && target === existingTarget) ||
              (source === existingTarget && target === existingSource)
            )
          })
        ) {
          acc.push({ source, target })
        }

        return acc
      }, [] as NodeLinkMapEntry[])
      .map(({ source, target }) => ({
        source: nodeMap[source],
        target: nodeMap[target],
      })),
  )
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const onDragMove = (currDrag) => {
    setPosition(() => ({
      x: -currDrag.dx,
      y: -currDrag.dy,
    }))
  }

  const { isDragging, dragStart, dragEnd, dragMove } = useDrag({
    onDragMove,
    resetOnStart: false,
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
          links,
        }}
        linkComponent={DefaultLink}
        nodeComponent={DefaultNode}
      />
    </svg>
  )
}

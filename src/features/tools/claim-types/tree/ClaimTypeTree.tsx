import styled from '@emotion/styled'
import { useDrag } from '@visx/drag'
import { DefaultLink, Graph } from '@visx/network'
import React, { useState } from 'react'

const data = [
  {
    claimType: 'Accident',
    properties: [
      {
        id: 'p1',
        name: 'Item',
        options: [
          { id: 'o1', name: 'Phone' },
          { id: 'o2', name: 'Computer' },
          { id: 'o5', name: 'Other electronics' },
        ],
      },
    ],
  },
  {
    claimType: 'Accidental Damage',
    properties: [
      {
        id: 'p1',
        name: 'Item',
        options: [
          { id: 'o1', name: 'Phone' },
          { id: 'o2', name: 'Computer' },
          { id: 'o5', name: 'Other electronics' },
        ],
      },
    ],
  },
  {
    claimType: 'Theft',
    properties: [
      {
        id: 'p1',
        name: 'Item',
        options: [
          { id: 'o1', name: 'Phone' },
          { id: 'o2', name: 'Computer' },
          { id: 'o3', name: 'Bag' },
          { id: 'o4', name: 'Valuables' },
        ],
      },
      {
        id: 'p2',
        name: 'Location',
        options: [
          { id: 'o6', name: 'Office' },
          { id: 'o7', name: 'Not office' },
        ],
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
  label: string
  variant: Variant
}

type Variant = 'type' | 'property' | 'option'

const nodeSpacing = 140
const circleRadius = 10

const idLinks: NodeLinkMapEntry[] = []
const nodeMap: Record<string, Node> = {}

const countedMap: Record<string, true> = {}

const typeCount = data.length
let optionCount = 0
let propertyCount = 0

data.forEach((type) => {
  type.properties.forEach((property) => {
    property.options.forEach((option) => {
      if (!countedMap[option.id]) {
        countedMap[option.id] = true
        optionCount += 1
      }
    })

    if (!countedMap[property.id]) {
      countedMap[property.id] = true
      propertyCount += 1
    }
  })
})

let optionIndex = 0
let propertyIndex = 0

data.forEach((type, typeIndex) => {
  type.properties.forEach((property) => {
    property.options.forEach((option) => {
      if (!nodeMap[option.id]) {
        nodeMap[option.id] = {
          x: (optionIndex - optionCount / 2) * nodeSpacing,
          y: 3 * nodeSpacing,
          label: option.name,
          variant: 'option',
        }
        optionIndex += 1
      }
      idLinks.push({ source: option.id, target: property.id })
    })

    if (!nodeMap[property.id]) {
      nodeMap[property.id] = {
        x: (propertyIndex - propertyCount / 2) * nodeSpacing,
        y: 2 * nodeSpacing,
        label: property.name,
        variant: 'property',
      }
      propertyIndex += 1
    }
    idLinks.push({ source: property.id, target: type.claimType })
  })

  nodeMap[type.claimType] = {
    x: (typeIndex - typeCount / 2) * nodeSpacing,
    y: nodeSpacing,
    label: type.claimType,
    variant: 'type',
  }
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

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })

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
        nodeComponent={({ node: { label, variant } }) => (
          <>
            <text x={-label.length * 4} y={-20} style={{ userSelect: 'none' }}>
              {label}
            </text>
            <NodeCircle
              cx={0}
              cy={0}
              r={
                variant === 'type'
                  ? circleRadius * 1.3
                  : variant === 'property'
                  ? circleRadius
                  : circleRadius / 1.3
              }
              variant={variant}
            />
          </>
        )}
      />
    </svg>
  )
}

const NodeCircle = styled.circle<{ variant: Variant }>`
  fill: ${({ theme, variant }) =>
    variant === 'type'
      ? theme.foreground
      : variant === 'property'
      ? theme.highlight
      : theme.accent};
`

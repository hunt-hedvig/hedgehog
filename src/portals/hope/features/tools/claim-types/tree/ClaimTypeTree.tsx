import styled from '@emotion/styled'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { useDrag } from '@visx/drag'
import { DefaultLink, Graph } from '@visx/network'
import React, { useEffect, useState } from 'react'
import { useGetClaimTypeTemplatesQuery } from 'types/generated/graphql'

interface NodeLink {
  source: Node
  target: Node
}

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

export const ClaimTypeTree: React.FC = () => {
  const circleRadius = 10
  const { data: claimTypeTemplateData } = useGetClaimTypeTemplatesQuery()

  const tree = claimTypeTemplateData?.claimTypeTemplates ?? []

  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<NodeLink[]>([])

  useEffect(() => {
    if (nodes.length !== 0) {
      return
    }

    const nodeSpacing = 200

    const idLinks: NodeLinkMapEntry[] = []
    const nodeMap: Record<string, Node> = {}

    const countedMap: Record<string, true> = {}

    const typeCount = tree.length
    let optionCount = 0
    let propertyCount = 0

    tree.forEach((type) => {
      type.properties.forEach((property) => {
        property.options.forEach((option) => {
          if (!countedMap[option.id]) {
            countedMap[option.id] = true
            optionCount += 1
          }
        })

        if (!countedMap[property.propertyId]) {
          countedMap[property.propertyId] = true
          propertyCount += 1
        }
      })
    })

    let optionIndex = 0
    let propertyIndex = 0

    tree.forEach((type, typeIndex) => {
      type.properties.forEach((property) => {
        property.options.forEach((option) => {
          if (!nodeMap[option.id]) {
            nodeMap[option.id] = {
              x: (optionIndex - optionCount / 2) * nodeSpacing,
              y:
                3 * nodeSpacing +
                (typeCount * nodeSpacing) / 10 +
                (propertyCount * nodeSpacing) / 10,
              label: option.name,
              variant: 'option',
            }
            optionIndex += 1
          }
          idLinks.push({ source: option.id, target: property.propertyId })
        })

        if (!nodeMap[property.propertyId]) {
          nodeMap[property.propertyId] = {
            x: (propertyIndex - propertyCount / 2) * nodeSpacing,
            y: 2 * nodeSpacing + (typeCount * nodeSpacing) / 10,
            label: property.name,
            variant: 'property',
          }
          propertyIndex += 1
        }
        idLinks.push({ source: property.propertyId, target: type.claimType })
      })

      nodeMap[type.claimType] = {
        x: (typeIndex - typeCount / 2) * nodeSpacing,
        y: nodeSpacing,
        label: type.claimType,
        variant: 'type',
      }
    })

    setNodes(Object.keys(nodeMap).map((id) => nodeMap[id]))

    setLinks(
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
  }, [tree])

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
          <g>
            {convertEnumToTitle(label)
              .split(' ')
              .reduce((acc, word, index) => {
                const chunkIndex = Math.floor(index / 2)

                if (!acc[chunkIndex]) {
                  acc[chunkIndex] = [] // start a new chunk
                }

                acc[chunkIndex].push(word)
                return acc
              }, [] as string[][])
              .slice(0)
              .reverse()
              .map((rowLabel, index) => (
                <text
                  x={-rowLabel.join(' ').length * 4}
                  y={-25 - index * 20}
                  style={{ userSelect: 'none' }}
                >
                  {rowLabel.join(' ')}
                </text>
              ))}
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
          </g>
        )}
      />
    </svg>
  )
}

const NodeCircle = styled.circle<{ variant: Variant }>`
  pointer-events: none;
  fill: ${({ theme, variant }) =>
    variant === 'type'
      ? theme.foreground
      : variant === 'property'
      ? theme.highlight
      : theme.accent};
`

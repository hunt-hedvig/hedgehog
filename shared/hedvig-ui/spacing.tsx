import styled from 'react-emotion'

export type SpacingSize = 'small' | 'medium' | 'large'
export type SpacingDirection = 'top' | 'right' | 'bottom' | 'left' | 'all'
export type SpacingWidth = 'full' | 'auto'

export interface SpacingProps
  extends Partial<Record<SpacingDirection, boolean | SpacingSize>> {
  width?: SpacingWidth
}

export const spacingMap: Record<SpacingSize, string> = {
  small: '1rem',
  medium: '2rem',
  large: '3rem',
}

export const Spacing = styled('div')<SpacingProps>`
  width: ${({ width }) => (width === 'auto' ? 'auto' : '100%')};
  padding-top: ${({ top, all }) => {
    if (!top && !all) {
      return 0
    }
    return spacingMap[
      top === true || all === true ? 'medium' : (top as SpacingSize)
    ]
  }};
  padding-right: ${({ right, all }) => {
    if (!right && !all) {
      return 0
    }
    return spacingMap[
      right === true || all === true ? 'medium' : (right as SpacingSize)
    ]
  }};
  padding-bottom: ${({ bottom, all }) => {
    if (!bottom && !all) {
      return 0
    }
    return spacingMap[
      bottom === true || all === true ? 'medium' : (bottom as SpacingSize)
    ]
  }};
  padding-left: ${({ left, all }) => {
    if (!left && !all) {
      return 0
    }
    return spacingMap[
      left === true || all === true ? 'medium' : (left as SpacingSize)
    ]
  }};
`

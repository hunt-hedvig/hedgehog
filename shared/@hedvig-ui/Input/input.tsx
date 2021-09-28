import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import React from 'react'
import {
  Input as SemanticInput,
  InputProps,
  LabelProps,
} from 'semantic-ui-react'
import { Keys, shouldIgnoreInput } from 'utils/hooks/key-press-hook'

export interface CustomInputProps extends InputProps {
  muted?: boolean
  affix?: LabelProps
  affixPosition?: 'left' | 'right'
}

const StyledSemanticInput = styled(SemanticInput)<CustomInputProps>`
  &&&& {
    width: 100%;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input {
      font-family: ${fonts.FAVORIT};

      transition: background 300ms, border-color 300ms;
      ${({ muted, theme }) =>
        muted
          ? css`
              background-color: ${theme.mutedBackground ?? colorsV3.gray300};
              border-color: ${theme.mutedBackground ?? colorsV3.gray300};
              color: ${theme.mutedText ?? colorsV3.gray500};
            `
          : css`
              :focus {
                border-color: ${theme.accent};
              }
            `}

  }
`

export const Input: React.FC<CustomInputProps> = (props) => (
  <StyledSemanticInput
    {...props}
    onKeyDown={(e) => {
      if (shouldIgnoreInput(e.key)) {
        e.preventDefault()
        return
      }

      if (e.keyCode === Keys.Escape.code) {
        e.preventDefault()
        e.target.blur()
        return
      }

      if (props.onKeyDown) {
        props.onKeyDown(e)
      }
    }}
  />
)

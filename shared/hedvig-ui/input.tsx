import { colorsV3, fonts } from '@hedviginsurance/brand'
import React from 'react'
import styled, { css } from 'react-emotion'
import { Input as SemanticInput, InputProps } from 'semantic-ui-react'

interface CustomInputProps {
  muted?: boolean
}

const StyledSemanticInput = styled(SemanticInput)<CustomInputProps>`
  &&& {
    width: 100%;
    input {
      font-family: ${fonts.FAVORIT};

      transition: background 300ms, border-color 300ms;
      ${({ muted, theme }) =>
        muted &&
        css`
          background-color: ${theme.mutedBackground ?? colorsV3.gray300};
          border-color: ${theme.mutedBackground ?? colorsV3.gray300};
          color: ${theme.mutedText ?? colorsV3.gray500};
        `};
    }
  }
`

export const Input: React.FunctionComponent<InputProps & CustomInputProps> = (
  props,
) => {
  return <StyledSemanticInput {...props} />
}

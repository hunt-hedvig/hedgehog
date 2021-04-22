import styled from '@emotion/styled'
import { spacingMap } from 'hedvig-ui/spacing'
import { Paragraph } from 'hedvig-ui/typography'

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const InfoRow = styled(Paragraph)`
  margin-bottom: 0.25rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const InfoText = styled('span')`
  color: ${({ theme }) => theme.foreground};
  text-align: right;
`

export const InfoSection = styled.div`
  padding-top: ${spacingMap.small};
  padding-bottom: ${spacingMap.small};
`

export const InfoDelimiter = styled.div<{ visible?: boolean }>`
  height: 1px;
  border-bottom: 1px solid
    ${({ theme, visible = true }) =>
      visible ? theme.placeholderColor : 'rgba(0, 0, 0, 0)'};
  margin-top: ${spacingMap.medium};
  margin-bottom: ${spacingMap.medium};
`

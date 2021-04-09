import { Paragraph } from 'hedvig-ui/typography'
import styled from '@emotion/styled'

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
`

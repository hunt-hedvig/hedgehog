import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { spacingMap } from 'hedvig-ui/spacing'
import { Paragraph } from 'hedvig-ui/typography'

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const InfoRow = styled(Paragraph)`
  margin-bottom: 0.5rem;
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
  margin-top: ${spacingMap.medium};
  margin-bottom: ${spacingMap.medium};
`

export const InfoDelimiter = styled.div<{ visible?: boolean }>`
  height: 1px;
  border-bottom: 1px solid
    ${({ theme, visible = true }) =>
      visible ? theme.placeholderColor : 'rgba(0, 0, 0, 0)'};
  margin-top: ${spacingMap.medium};
  margin-bottom: ${spacingMap.medium};
`

const mapInfoTagStatus = (status: 'success' | 'warning' | 'danger') => {
  const theme = useTheme()

  if (status === 'warning') {
    return { backgroundColor: theme.lightWarning, color: theme.darkWarning }
  }

  if (status === 'danger') {
    return { backgroundColor: theme.lightDanger, color: theme.danger }
  }

  return { backgroundColor: theme.lightSuccess, color: theme.success }
}

export type InfoTagStatus = 'success' | 'warning' | 'danger'

export const InfoTag = styled.div<{
  status?: InfoTagStatus
}>`
  background-color: ${({ status = 'success' }) =>
    mapInfoTagStatus(status).backgroundColor};
  padding: 0em 0.7em;
  color: ${({ status = 'success' }) => mapInfoTagStatus(status).color};
  border-radius: 7px;
  font-size: 0.85em;
`

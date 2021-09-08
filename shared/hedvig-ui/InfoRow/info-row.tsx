import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { spacingMap } from '@hedvig-ui'

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const InfoRow = styled.span`
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
  margin-top: ${spacingMap.medium};
  margin-bottom: ${spacingMap.medium};
`

const mapInfoTagStatus = (status: InfoTagStatus) => {
  const theme = useTheme()

  if (status === 'warning') {
    return { backgroundColor: theme.lightWarning, color: theme.darkWarning }
  }

  if (status === 'danger') {
    return { backgroundColor: theme.lightDanger, color: theme.danger }
  }

  if (status === 'highlight') {
    return { backgroundColor: theme.highlight, color: theme.darkHighlight }
  }

  if (status === 'neutral') {
    return { backgroundColor: '#e7e7e7', color: '#777777' }
  }

  return { backgroundColor: theme.lightSuccess, color: theme.success }
}

export type InfoTagStatus =
  | 'success'
  | 'warning'
  | 'danger'
  | 'highlight'
  | 'neutral'

export const InfoTag = styled.div<{
  status?: InfoTagStatus
}>`
  background-color: ${({ status = 'success' }) =>
    mapInfoTagStatus(status).backgroundColor};
  padding: 0 0.7em;
  color: ${({ status = 'success' }) => mapInfoTagStatus(status).color};
  border-radius: 7px;
  font-size: 0.85em;
`

import {
  MainHeadline,
  Paragraph,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import styled, { css, keyframes } from 'react-emotion'

export const Capitalized = styled.div`
  ::first-letter {
    text-transform: uppercase;
  }
  text-transform: lowercase;
`

const getThemeFromStatus = (theme, status) => {
  switch (status) {
    case 'ACTIVE':
      return theme.success
    case 'UNREDEEMED':
      return theme.danger
    default:
      return theme.accent
  }
}

export const MemberStatusBadge = styled.div<{ status?: string }>`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ theme, status }) => getThemeFromStatus(theme, status)};
  border-radius: 16px;
  color: ${({ theme }) => theme.accentContrast};
  text-align: center;
  width: auto;
`

export const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

export const spin = keyframes`
  from{transform: rotate(0deg)}
  to{transform: rotate(360deg)}
`
export const RefreshButton = styled.button<{ loading: boolean }>`
  background: transparent;
  font-size: 0.875em;
  color: ${({ theme }) => theme.mutedText};
  padding: 0;
  border: 0;
  margin-left: 1rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: transform 500ms;
  ${({ loading }) =>
    loading &&
    css`
      animation: ${spin} 500ms linear infinite;
    `};
`

export const ReferralStatusBadge = styled.div<{ eligible: boolean }>`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ eligible, theme }) =>
    eligible ? theme.success : theme.danger};
  border-radius: 8px;
  color: #fff;
`

export const CampaignCodeBadge = styled.div`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ theme }) => theme.accent};
  border-radius: 8px;
  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
`

export const BadgeRow = styled(Paragraph)`
  margin-top: 0.3rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const TableHeadline = styled(ThirdLevelHeadline)`
  margin-bottom: -0.2rem;
`

export const NotAvailableLabel = styled.div`
  color: ${({ theme }) => theme.placeholderColor};
`

export const SmallTopSpacing = styled.div`
  margin-top: 0.2rem;
`

export const Group = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  '*:not(:last-child)': {
    marginRight: '0.5rem',
  },
  '*:not(:first-child)': {
    marginLeft: '0.5rem',
  },
})

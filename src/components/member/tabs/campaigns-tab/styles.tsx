import { Paragraph, ThirdLevelHeadline } from 'hedvig-ui/typography'
import styled from 'react-emotion'

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

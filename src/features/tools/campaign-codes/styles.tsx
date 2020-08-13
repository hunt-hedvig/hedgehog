import { Paragraph } from 'hedvig-ui/typography'
import styled from 'react-emotion'

const getBadgeColor = (theme, variant?: string) => {
  switch (variant) {
    case 'success':
      return theme.success
    case 'danger':
      return theme.danger
    default:
      return theme.accent
  }
}

export const Badge = styled.span<{ variant?: string; width?: string }>`
  padding: 0.5rem 0rem;
  width: ${({ width }) => width ?? 'auto'};
  line-height: 1;
  background: ${({ variant, theme }) => getBadgeColor(theme, variant)};
  border-radius: 4px;
  color: ${({ theme }) => theme.accentContrast};
  text-align: center;
`

export const BadgeRow = styled(Paragraph)`
  margin-top: 0.3rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
`

export const Centered = styled.div`
  margin: 0 auto;
  display: block;
`

export const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

export const ValidityText = styled.span`
  font-size: 0.9em;
  display: flex;
  justify-content: center;
`

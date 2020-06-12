import { Chip, Select, withStyles } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import CallSplitIcon from '@material-ui/icons/CallSplit'
import TodayIcon from '@material-ui/icons/Today'
import styled from 'react-emotion'

export const categorySelectTheme = {
  borderRadius: 0,
}

export const categorySelectStyle = {
  control: (base) => ({
    ...base,
    marginTop: '6px',
    borderRadius: 1,
    border: '0px',
    borderBottom: `1px solid white`,
    boxShadow: 'none',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    hyphens: 'auto',
    marginTop: 0,
    textAlign: 'left',
    wordWrap: 'break-word',
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: '0px',
    overflow: 'visible',
  }),
  multiValueRemove: (base) => ({ ...base, display: 'none' }),
  multiValue: (base) => ({
    ...base,
    paddingLeft: '5px',
    paddingRight: '10px',
    border: '1px solid',
    borderRadius: 20,
  }),
  placeholder: () => ({
    display: 'none',
  }),
}

export const UpcomingChip = styled(Chip)`
  font-weight: bold;
  color: ${({ theme }) => theme.accentContrast};
  border: 1px solid ${({ theme }) => theme.accentContrast};
`

export const CurrentChip = styled(Chip)`
  font-weight: bold;
  color: ${({ theme }) => theme.accentContrast};
  border: 1px solid ${({ theme }) => theme.accentContrast};
`

export const PreviousChip = styled(Chip)`
  font-weight: bold;
  color: ${({ theme }) => theme.accentContrast};
  border: 1px solid ${({ theme }) => theme.accentContrast};
`

export const MultipleArrowsRight = styled(CallSplitIcon)`
  margin-bottom: -6px;
  margin-right: 3px;
  margin-left: 3px;
  color: ${({ theme }) => theme.accentContrast};
  transform: rotate(90deg);
  font-size: medium;
`

export const SmallArrowRight = styled(ArrowRightIcon)`
  margin-bottom: -5px;
  margin-right: 3px;
  margin-left: 3px;
  color: ${({ theme }) => theme.accentContrast};
  font-size: medium;
`

export const DateIcon = withStyles({
  root: {
    fontSize: '1.2rem',
    color: '#555',
  },
})(TodayIcon)

export const DateIconWrapper = styled.span`
  color: ${({ theme }) => theme.danger};
`

export const TrashIconWrapper = styled.span`
  color: ${({ theme }) => theme.danger};
  font-size: 0.9rem;
`

export const Bold = styled.span`
  font-weight: bold;
`

export const Placeholder = styled.div`
  color: ${({ theme }) => theme.placeholderColor};
`

export const CurrencySelect = styled(Select)`
  color: ${({ theme }) => theme.foreground};
  text-align: right;
`

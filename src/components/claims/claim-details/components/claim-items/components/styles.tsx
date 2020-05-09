import { Chip, withStyles } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import CallSplitIcon from '@material-ui/icons/CallSplit'
import TodayIcon from '@material-ui/icons/Today'

export const categorySelectStyle = {
  control: (base, { isFocused }) => ({
    ...base,
    marginTop: '6px',
    background: 'rgba(0, 0, 0, 0.0)',
    // match with the menu
    borderRadius: 0,
    border: '0px',
    borderBottom: isFocused ? '1px solid #0f007a' : '1px solid #999999',
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
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    border: '1px solid #5b30f5',
    borderRadius: 20,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#5b30f5',
    fontWeight: 'bold',
  }),
  option: (base, { data }) => {
    const isCreateOption = typeof data?.nextKind === 'undefined'

    return {
      ...base,
      color: isCreateOption ? '#5b30f5' : null,
    }
  },
  placeholder: () => ({
    display: 'none',
  }),
}

export const PreviousChip = withStyles({
  root: {
    fontWeight: 500,
    color: '#555',
  },
})(Chip)

export const CurrentChip = withStyles({
  root: {
    fontWeight: 500,
  },
})(Chip)

export const UpcomingChip = withStyles({
  root: {
    fontWeight: 500,
    color: '#bbb',
  },
})(Chip)

export const MultipleArrowsRight = withStyles({
  root: {
    marginBottom: '-6px',
    marginRight: '3px',
    marginLeft: '3px',
    color: '#555',
    transform: 'rotate(90deg)',
    fontSize: 'medium',
  },
})(CallSplitIcon)

export const SmallArrowRight = withStyles({
  root: {
    marginBottom: '-5px',
    marginRight: '3px',
    marginLeft: '3px',
    color: '#555',
    fontSize: 'medium',
  },
})(ArrowRightIcon)

export const DateIcon = withStyles({
  root: {
    fontSize: '1.2rem',
    color: '#555',
  },
})(TodayIcon)

import { Chip, withStyles } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import CallSplitIcon from '@material-ui/icons/CallSplit'

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

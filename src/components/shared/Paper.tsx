import { Paper as MuiPaper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'

export interface PaperProps {
  children: object
  component?: React.SFC
  square?: boolean
}

export const StyledPaper = withStyles({
  root: {
    padding: '2rem',
    minHeight: '20rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiPaper)

export const Paper: React.SFC<PaperProps> = ({
  children,
  component,
  square,
}) => (
  <StyledPaper component={component} elevation={0} square={square}>
    {children}
  </StyledPaper>
)

import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

const styles = (theme) => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
})

const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

interface MaterialModalProps {
  classes: any
  open: boolean
  handleClose: () => void
  children?: ReactNode
}

const MaterialModal: React.SFC<MaterialModalProps> = (props) => {
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <div style={getModalStyle()} className={props.classes.paper}>
        {props.children}
      </div>
    </Modal>
  )
}

export default withStyles(styles)(MaterialModal)

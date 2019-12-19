import React from 'react'
import { useState } from 'react'
import actions from 'store/actions'
import { connect } from 'react-redux'
import { CreateNewTicket } from '../create-ticket/create-ticket'
import Modal from '../../../../components/shared/modals/MaterialModal'
import { Button } from 'semantic-ui-react'
import styled from 'react-emotion'
import { Tickets } from '../../tickets'
import { EOrder } from '../../types'

interface props {
  showNotification: (data: any) => void
  claimId: string
}

const ButtonWrapper = styled('div')({
  padding: '2rem',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(0,0,0,0.08)',
})

const TicketTitle = styled('h3')({
  padding: '0.5rem',
})

const CreateTicketStandAloneComponent: React.FunctionComponent<props> = ({
  showNotification,
  claimId,
}) => {
  const [showModal, setModal] = useState(false)
  const [filter, setFilter] = useState({
    assignedTo: 'Everyone',
    status: 'All',
    type: 'All',
    claimId: claimId,
  })
  const [sort, setSort] = useState({ category: 'priority', order: EOrder.DESC })

  const closeModal = (): void => {
    setModal(false)
  }

  const onClicked = () => {
    setModal(true)
  }

  return (
    <>
      <ButtonWrapper>
        <TicketTitle>Create Tickets</TicketTitle>
        <Button onClick={onClicked}>Create New Ticket</Button>
      </ButtonWrapper>

      <Modal open={showModal} handleClose={closeModal}>
        <CreateNewTicket
          closeModal={closeModal}
          showNotification={showNotification}
          claimId={claimId}
        />
      </Modal>

      <Tickets sort={sort} filter={filter} />
    </>
  )
}

const mapActions = { ...actions.notificationsActions }

export const CreateTicketStandAlone = connect(
  null,
  mapActions,
)(CreateTicketStandAloneComponent)

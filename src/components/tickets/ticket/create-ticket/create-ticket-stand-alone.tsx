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
  referenceId: string
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
  referenceId,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState({
    assignedTo: 'Everyone',
    status: 'All',
    type: 'All',
    referenceId: referenceId,
  })
  const [sort, setSort] = useState({ category: 'priority', order: EOrder.DESC })

  return (
    <>
      <ButtonWrapper>
        <TicketTitle>Create Tickets</TicketTitle>
        <Button onClick={() => setShowModal(true)}>Create New Ticket</Button>
      </ButtonWrapper>

      <Modal open={showModal} handleClose={() => setShowModal(false)}>
        <CreateNewTicket
          closeModal={() => setShowModal(false)}
          showNotification={showNotification}
          referenceId={referenceId}
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

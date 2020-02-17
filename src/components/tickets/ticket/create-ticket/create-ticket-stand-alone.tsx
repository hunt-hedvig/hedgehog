// @ts-nocheck
import React from 'react'
import { useState } from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import actions from 'store/actions'
import Modal from '../../../../components/shared/modals/MaterialModal'
import { Tickets } from '../../tickets'
import { EOrder } from '../../types'
import { CreateNewTicket } from '../create-ticket/create-ticket'

interface CreateTicketStandAloneProps {
  showNotification: (data: any) => void
  referenceId: string
  memberId: string
  ticketType: string
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

export const CreateTicketStandAloneComponent: React.FunctionComponent<CreateTicketStandAloneProps> = ({
  showNotification,
  referenceId,
  memberId,
  ticketType,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState({
    assignedTo: 'Everyone',
    status: 'All',
    type: 'All',
    referenceId: referenceId ?? 'All',
    memberId: memberId ?? 'All',
  })
  const [sort, setSort] = useState({ category: 'priority', order: EOrder.DESC })

  return (
    <>
      <ButtonWrapper>
        <TicketTitle>Create Tickets</TicketTitle>
        <Button primary onClick={() => setShowModal(true)}>
          Create New Ticket
        </Button>
      </ButtonWrapper>

      <Modal open={showModal} handleClose={() => setShowModal(false)}>
        <CreateNewTicket
          closeModal={() => setShowModal(false)}
          showNotification={showNotification}
          referenceId={referenceId}
          memberId={memberId}
          type={ticketType}
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

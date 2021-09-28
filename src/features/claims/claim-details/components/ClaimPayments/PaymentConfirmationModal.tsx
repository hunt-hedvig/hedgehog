import styled from '@emotion/styled'
import { Button, ButtonsGroup, Input, Modal, Paragraph } from '@hedvig-ui'
import React, { useState } from 'react'
import { Market } from 'types/enums'
import { Keys } from 'utils/hooks/key-press-hook'

const Explanation = styled(Paragraph)`
  margin-top: 2em;
  font-size: 0.9em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

interface PaymentConfirmationModalProps {
  onClose: () => void
  onSubmit: () => void
  amount: string
  identified: boolean
  market?: string | null
}

export const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  onClose,
  onSubmit,
  amount,
  identified,
  market,
}) => {
  const [confirmAmount, setConfirmAmount] = useState('')

  const confirmHandler = () => {
    onSubmit()
    setConfirmAmount('')
    onClose()
  }

  return (
    <Modal onClose={onClose} title="Confirm payout" width="500px">
      {!identified && market === Market.Norway && (
        <Explanation>
          ⚠️ Please note that this member is not identified
        </Explanation>
      )}
      <Explanation>
        To perform the payment, confirm it by entering "{amount}" below.
      </Explanation>
      <Input
        autoFocus
        name="confirmation"
        placeholder="Amount"
        value={confirmAmount}
        onChange={(e) => setConfirmAmount(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.keyCode === Keys.Enter.code) {
            e.preventDefault()
            confirmHandler()
          }
        }}
      />
      <ButtonsGroup style={{ marginTop: '1em' }}>
        <Button
          type="submit"
          variation="primary"
          disabled={confirmAmount !== amount}
          onClick={confirmHandler}
        >
          Confirm
        </Button>
        <Button
          variation="ghost"
          style={{ marginLeft: '1.0em' }}
          onClick={() => {
            onClose()
          }}
        >
          Cancel
        </Button>
      </ButtonsGroup>
    </Modal>
  )
}
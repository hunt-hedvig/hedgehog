import styled from '@emotion/styled'
import { Button, ButtonsGroup, Input, Modal } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { Market } from 'portals/hope/features/config/constants'
import React, { useState } from 'react'

const Explanation = styled.p`
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
  visible: boolean
}

export const PaymentConfirmationModal: React.FC<
  PaymentConfirmationModalProps
> = ({ onClose, onSubmit, amount, identified, market, visible }) => {
  const [confirmAmount, setConfirmAmount] = useState('')

  const confirmHandler = () => {
    onSubmit()
    setConfirmAmount('')
    onClose()
  }

  return (
    <Modal
      style={{ padding: '1rem', width: 500 }}
      onClose={onClose}
      visible={visible}
    >
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
          if (isPressing(e, Keys.Enter) && confirmAmount === amount) {
            e.preventDefault()
            confirmHandler()
          }
        }}
      />
      <ButtonsGroup style={{ marginTop: '1em' }}>
        <Button
          type="submit"
          disabled={confirmAmount !== amount}
          onClick={confirmHandler}
        >
          Confirm
        </Button>
        <Button
          variant="tertiary"
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

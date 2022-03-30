import styled from '@emotion/styled'
import { Button, ButtonsGroup, Checkbox, Input, Modal } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { Market } from 'portals/hope/features/config/constants'
import React, { useState } from 'react'

const Explanation = styled.p`
  margin-top: 2em;
  font-size: 0.9em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const CloseClaimCheckbox = styled(Checkbox)`
  margin-left: auto;
`

interface PaymentConfirmationModalProps {
  onClose: () => void
  onSubmit: (closeClaim: boolean) => void
  amount: string
  identified: boolean
  market?: string | null
  isClaimClosed: boolean
  visible: boolean
}

export const PaymentConfirmationModal: React.FC<
  PaymentConfirmationModalProps
> = ({
  onClose,
  onSubmit,
  amount,
  identified,
  market,
  visible,
  isClaimClosed,
}) => {
  const [closeClaim, setCloseClaim] = useState(false)
  const [confirmAmount, setConfirmAmount] = useState('')

  const confirmHandler = () => {
    onSubmit(closeClaim)
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
        {!isClaimClosed && (
          <CloseClaimCheckbox
            label="Also close the claim"
            checked={closeClaim}
            onChange={() => setCloseClaim((prev) => !prev)}
          />
        )}
      </ButtonsGroup>
    </Modal>
  )
}

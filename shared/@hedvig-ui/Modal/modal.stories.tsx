import styled from '@emotion/styled'
import { Button, Modal, ModalAdditionalOptions } from '@hedvig-ui'
import { boolean, select, text } from '@storybook/addon-knobs'
import React from 'react'

const ConfirmButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
`

export default {
  title: 'Modal',
  component: Modal,
}

const positions: ReadonlyArray<
  NonNullable<ModalAdditionalOptions['position']>
> = ['top', 'center', 'bottom']

const sides: ReadonlyArray<NonNullable<ModalAdditionalOptions['side']>> = [
  'left',
  'center',
  'right',
]

export const StandardModal = () => {
  const [isModal, setIsModal] = React.useState(false)

  return (
    <>
      <Button onClick={() => setIsModal(true)}>Open Modal</Button>
      {isModal && (
        <Modal
          options={{
            disableClickOutside: !boolean('With click outside', true),
            position: select('Position', positions, 'center'),
            side: select('Side', sides, 'center'),
          }}
          onClose={() => setIsModal(false)}
        >
          {text('Body content', 'Modal body')}
        </Modal>
      )}
    </>
  )
}

export const ConfirmModal = () => {
  const [isModal, setIsModal] = React.useState(false)

  return (
    <>
      <Button status="danger" onClick={() => setIsModal(true)}>
        Delete
      </Button>
      {isModal && (
        <Modal
          options={{
            disableClickOutside: !boolean('With click outside', false),
            position: select('Position', positions, 'top'),
            side: select('Side', sides, 'center'),
          }}
          onClose={() => setIsModal(false)}
        >
          <div>
            <h3>Are you sure?</h3>
            <ConfirmButtons>
              <Button status="success" onClick={() => setIsModal(false)}>
                Confirm
              </Button>
              <Button variant="tertiary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
            </ConfirmButtons>
          </div>
        </Modal>
      )}
    </>
  )
}

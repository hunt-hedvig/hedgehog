import styled from '@emotion/styled'
import { Button, Modal, ModalProps } from '@hedvig-ui'
import { boolean, number, select, text } from '@storybook/addon-knobs'
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

const positions: ReadonlyArray<NonNullable<ModalProps['position']>> = [
  'top',
  'center',
  'bottom',
]
const sides: ReadonlyArray<NonNullable<ModalProps['side']>> = [
  'left',
  'center',
  'right',
]

export const StandartModal = () => {
  const [isModal, setIsModal] = React.useState(false)

  return (
    <>
      <Button variation="primary" onClick={() => setIsModal(true)}>
        Open Modal
      </Button>
      {isModal && (
        <Modal
          withoutHeader={!boolean('With header', true)}
          disableClickOutside={!boolean('With click outside', true)}
          height={`${number('Height of modal', 250)}px`}
          width={`${number('Width of modal', 350)}px`}
          position={select('Position', positions, 'center')}
          side={select('Side', sides, 'center')}
          title={text('Title content', 'Modal title')}
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
      <Button variation="danger" onClick={() => setIsModal(true)}>
        Delete
      </Button>
      {isModal && (
        <Modal
          withoutHeader={!boolean('With header', false)}
          disableClickOutside={!boolean('With click outside', false)}
          height={`${number('Height of modal', 110)}px`}
          width={`${number('Width of modal', 400)}px`}
          position={select('Position', positions, 'top')}
          side={select('Side', sides, 'center')}
          onClose={() => setIsModal(false)}
        >
          <div>
            <h3>Are you sure?</h3>
            <ConfirmButtons>
              <Button
                fullWidth
                variation="success"
                onClick={() => setIsModal(false)}
              >
                Confirm
              </Button>
              <Button
                fullWidth
                variation="secondary"
                onClick={() => setIsModal(false)}
              >
                Cancel
              </Button>
            </ConfirmButtons>
          </div>
        </Modal>
      )}
    </>
  )
}

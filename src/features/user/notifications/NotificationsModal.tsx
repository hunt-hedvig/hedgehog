import styled from '@emotion/styled'
import { Bold, Flex, Modal, ThirdLevelHeadline } from '@hedvig-ui'
import chroma from 'chroma-js'
import React from 'react'

const NotificationItem = styled(Flex)`
  :first-of-type {
    margin-top: 0;
  }

  margin-top: 1rem;

  border-radius: 8px;
  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(2)
      .alpha(0.1)
      .hex()};
  padding: 1rem;
  cursor: pointer;
`

const UserCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 2.8rem;
  width: 2.8rem;
  border-radius: 50%;

  margin-left: 0.5rem;

  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
  font-size: 1.2rem;

  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(1)
      .hex()};
`

const NotificationMessage = styled.div`
  padding-left: 1rem;
  font-size: 1rem;
  text-overflow: ellipsis;
`

const NotificationTimestamp = styled.div`
  padding-left: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) =>
    chroma(theme.semiStrongForeground)
      .brighten(0.75)
      .hex()};
  padding-top: 0.2rem;
`

export const NotificationsModal: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      withoutHeader={true}
      width="400px"
      height="83vh"
      side="right"
      dimBackground={false}
    >
      <Flex style={{ padding: '1rem' }} direction="column">
        <ThirdLevelHeadline>Notifications</ThirdLevelHeadline>
        <NotificationItem align="center">
          <UserCircle>RG</UserCircle>
          <Flex direction="column">
            <NotificationMessage>
              <Bold>Rasmus</Bold> mentioned you in a claim
            </NotificationMessage>
            <NotificationTimestamp>2 hours ago</NotificationTimestamp>
          </Flex>
        </NotificationItem>
        <NotificationItem align="center">
          <UserCircle>EG</UserCircle>
          <Flex direction="column">
            <NotificationMessage>
              <Bold>Elvin</Bold> just gave you access to a restricted claim
            </NotificationMessage>
            <NotificationTimestamp>2 hours ago</NotificationTimestamp>
          </Flex>
        </NotificationItem>
      </Flex>
    </Modal>
  )
}

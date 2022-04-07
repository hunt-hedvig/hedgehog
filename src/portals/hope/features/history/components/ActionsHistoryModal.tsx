import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useClickOutside } from '@hedvig-ui'
import { keyframes } from '@emotion/react'
import { Action } from '../use-actions-history'
import { ArrowReturnLeft } from 'react-bootstrap-icons'

const show = keyframes`
  from {
    right: -20%;
  }

  to {
    right: 0;
  }
`

const hide = keyframes`
  from {
    right: 0;
  }

  to {
    right: -20%;
  }
`

const Container = styled.div<{ closing: boolean }>`
  transition: right 400ms;

  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;

  width: 20%;
  height: 100%;

  background-color: ${({ theme }) => theme.accentBackground};
  box-shadow: -6px 0px 14px 0px rgba(34, 60, 80, 0.2);

  animation: ${({ closing }) => (closing ? hide : show)} 400ms;

  display: flex;
  flex-direction: column;

  & h2 {
    color: ${({ theme }) => theme.foreground};
  }
`

const Header = styled.div`
  padding: 1rem;
  text-align: center;

  font-size: 18px;

  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundLight};
`

const Content = styled.div`
  padding: 20px 15px;
  margin-bottom: 6rem;
  overflow-y: auto;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ActionsHistoryModal: React.FC<{
  hide: () => void
  actionsList: Action[]
  deleteAction: (id: string) => void
}> = ({ hide, actionsList }) => {
  const [closing, setClosing] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const smoothHideHandler = () => {
    setClosing(true)
    setTimeout(() => {
      hide()
      setClosing(false)
    }, 350)
  }

  useClickOutside(containerRef, smoothHideHandler)

  return (
    <Container ref={containerRef} closing={closing}>
      <Header>History</Header>
      <Content>
        {actionsList.reverse().map((action) => (
          <ActionItem {...action} />
        ))}
      </Content>
    </Container>
  )
}

const ActionContainer = styled.div`
  position: relative;

  width: 100%;

  padding: 1rem;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0.25rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RevertIcon = styled(ArrowReturnLeft)`
  padding: 1rem;
  border-radius: 50%;
  width: min-content;
  height: min-content;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.accentLighter};
  }
`

const DateInfo = styled.span`
  font-size: 10px;
  position: absolute;
  bottom: 0.25rem;
  right: 1rem;
  color: ${({ theme }) => theme.placeholderColor};
`

const ActionItem = (
  { revertAction, title, id, date }: Action,
  deleteAction: (id: string) => void,
) => {
  const revertHandler = () => {
    revertAction()
    deleteAction(id)
  }

  return (
    <ActionContainer>
      <span>{title}</span>
      <DateInfo>{date.toDateString()}</DateInfo>
      <RevertIcon onClick={revertHandler} />
    </ActionContainer>
  )
}

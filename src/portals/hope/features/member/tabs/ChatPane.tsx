import styled from '@emotion/styled'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { motion } from 'framer-motion'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { ChatPanel } from 'portals/hope/features/member/chat/ChatPanel'
import { MessagesList } from 'portals/hope/features/member/messages/MessagesList'
import React, { useEffect, useRef } from 'react'
import { ChevronDoubleDown } from 'react-bootstrap-icons'

const ChevronDoubleIcon = styled(ChevronDoubleDown)<{ visible: number }>`
  height: 100%;
  width: 20px;
  transform: scaleY(${({ visible }) => visible});
`

const ChatContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  right: 1.5rem;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  z-index: 999;
  overflow: hidden;
`

const ChatHeaderStyle = styled.div`
  height: 40px;
  color: ${({ theme }) => theme.foreground};
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  cursor: pointer;
`

const MessageListWithBackground = styled(MessagesList)`
  background-color: ${({ theme }) => theme.backgroundLight};
`

const variants = {
  open: { width: '400px', height: '80vh' },
  closed: { width: '200px', height: '40px' },
}

export const ChatPane: React.FC<{ memberId: string }> = ({ memberId }) => {
  const manualChange = useRef(false)
  const [isVisible, setIsVisible] = useInsecurePersistentState<boolean>(
    'chat:visible',
    window.innerWidth > 1000,
  )
  const visible = useRef(isVisible)

  const { registerActions, isHintingOption } = useCommandLine()

  registerActions([
    {
      label: 'Toggle chat',
      keys: [Keys.Option, Keys.W],
      onResolve: () => {
        onResizeClick()
      },
    },
  ])

  useEffect(() => {
    visible.current = isVisible
  }, [isVisible])

  const resizeControlChat = () => {
    if (!manualChange.current) {
      setIsVisible(window.innerWidth > 1000)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', resizeControlChat)
    return () => window.removeEventListener('resize', resizeControlChat)
  }, [])

  const onResizeClick = () => {
    setIsVisible(!visible.current)
    manualChange.current = true
  }

  return (
    <ChatContainer
      animate={isVisible ? 'open' : 'closed'}
      variants={variants}
      transition={{ bounce: 0 }}
    >
      {isVisible ? (
        <>
          <ChatHeader
            visible={isVisible}
            onResizeClick={onResizeClick}
            isHinting={isHintingOption}
          />
          <MessageListWithBackground memberId={memberId} />
          <ChatPanel memberId={memberId} />
        </>
      ) : (
        <ChatHeader
          visible={isVisible}
          onResizeClick={onResizeClick}
          isHinting={isHintingOption}
        />
      )}
    </ChatContainer>
  )
}

const ChatHeader: React.FC<{
  visible: boolean
  isHinting: boolean
  onResizeClick: () => void
}> = ({ visible, isHinting, onResizeClick }) => (
  <ChatHeaderStyle onClick={onResizeClick}>
    <h4>Chat</h4>
    {isHinting ? '(W)' : <ChevronDoubleIcon visible={visible ? -1 : 1} />}
  </ChatHeaderStyle>
)

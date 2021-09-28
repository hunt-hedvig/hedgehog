import styled from '@emotion/styled'
import { useCommandLine } from '@hedvig-ui/utils/command-line-hook'
import { Keys } from '@hedvig-ui/utils/key-press-hook'
import { ChatPanel } from 'features/member/chat/ChatPanel'
import { MessagesList } from 'features/member/messages/MessagesList'
import React, { useEffect, useRef } from 'react'
import { Icon } from 'semantic-ui-react'
import { useInsecurePersistentState } from 'utils/state'

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  right: 10px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  z-index: 999;
  overflow: hidden;
`

const OpenChatContainer = styled(ChatContainer)`
  width: 400px;
  height: 80vh;
`

const ClosedChatContainer = styled(ChatContainer)`
  width: 200px;
  height: 40px;
`

const ChatHeaderStyle = styled.div<{ visible: boolean }>`
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

  return isVisible ? (
    <OpenChatContainer>
      <ChatHeader
        visible={isVisible}
        onResizeClick={onResizeClick}
        isHinting={isHintingOption}
      />
      <MessageListWithBackground memberId={memberId} />
      <ChatPanel memberId={memberId} />
    </OpenChatContainer>
  ) : (
    <ClosedChatContainer>
      <ChatHeader
        visible={isVisible}
        onResizeClick={onResizeClick}
        isHinting={isHintingOption}
      />
    </ClosedChatContainer>
  )
}

const ChatHeader: React.FC<{
  visible: boolean
  isHinting: boolean
  onResizeClick: () => void
}> = ({ visible, isHinting, onResizeClick }) => (
  <ChatHeaderStyle onClick={onResizeClick} visible={visible}>
    <h4>Chat</h4>
    {isHinting ? (
      '(W)'
    ) : (
      <Icon
        name={visible ? 'angle double up' : 'angle double down'}
        size="large"
        link
      />
    )}
  </ChatHeaderStyle>
)

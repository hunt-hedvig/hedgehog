import styled from '@emotion/styled'
import { ChatPanel } from 'components/member/chat/ChatPanel'
import { MessagesList } from 'components/member/messages/MessagesList'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys } from 'utils/hooks/key-press-hook'

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
`

export const ChatPane: React.FC<{ memberId: string }> = ({ memberId }) => {
  const manualChange = useRef(false)
  const [isVisible, setIsVisible] = useState(window.innerWidth > 1000)
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
      <MessagesList memberId={memberId} />
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
  <ChatHeaderStyle visible={visible}>
    <h4>Chat</h4>
    {isHinting ? (
      '(W)'
    ) : (
      <Icon
        name={visible ? 'angle double up' : 'angle double down'}
        size={'large'}
        link
        onClick={onResizeClick}
      />
    )}
  </ChatHeaderStyle>
)
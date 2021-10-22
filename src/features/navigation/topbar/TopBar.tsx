import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { GearFill, PeopleFill } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 4.5rem;
  padding: 1rem 2rem;
`

const Username = styled(Flex)`
  background-color: transparent;
  border-radius: 8px;
  padding: 0.4em 0.8em;
  cursor: pointer;
`

const CircleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border: none;
  outline: none;

  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;

  transition: all 200ms;

  :hover {
    background-color: ${({ theme }) => theme.accentLighter};
  }
`

const UserPanel = styled.div<{ visible: boolean }>`
  transition: right 400ms;

  position: absolute;
  top: 0;
  right: ${({ visible }) => (visible ? '0' : '-300px')};

  height: 100vh;
  width: 300px;

  background-color: ${({ theme }) => theme.foreground};
  z-index: 1000;
`

const TopBarContainer = styled(Flex)<{ pushLeft: boolean }>`
  transition: margin-right 400ms;
  margin-right: ${({ pushLeft }) => (pushLeft ? '300px' : '0')};
`

export const TopBar: React.FC = () => {
  const history = useHistory()
  const { me } = useMe()
  const [showUsers, setShowUsers] = useState(false)

  return (
    <Wrapper>
      <UserPanel visible={showUsers} />
      <TopBarContainer
        pushLeft={showUsers}
        direction="row"
        justify="flex-end"
        align="center"
      >
        <div>
          <Username
            direction="row"
            justify="flex-end"
            align="center"
            onClick={() => history.push('/profile')}
          >
            <span>{me.fullName}</span>
            <CircleButton style={{ marginLeft: '2em' }}>
              <GearFill />
            </CircleButton>
          </Username>
        </div>
        <CircleButton
          style={{ marginLeft: '0.25em' }}
          onClick={() => setShowUsers(!showUsers)}
        >
          <PeopleFill />
        </CircleButton>
      </TopBarContainer>
    </Wrapper>
  )
}

import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { Keys, useKeyIsPressed } from '@hedvig-ui/utils/key-press-hook'
import { UserPanel } from 'features/user/UserPanel'
import React, { useEffect, useState } from 'react'
import { GearFill, PeopleFill } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Me } from 'types/generated/graphql'

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
  margin-bottom: 2rem;
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

const TopBarContainer = styled(Flex)<{ pushLeft: boolean }>`
  transition: margin-right 400ms;
  margin-right: ${({ pushLeft }) => (pushLeft ? '300px' : '0')};
`

export const TopBar: React.FC<{ me?: Me }> = ({ me }) => {
  const history = useHistory()
  const [showUsers, setShowUsers] = useState(false)

  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    if (isEscapePressed) {
      setShowUsers(false)
    }
  }, [isEscapePressed])

  return (
    <Wrapper>
      <UserPanel
        visible={showUsers}
        onClickOutside={() => setShowUsers(false)}
      />
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
            <span>{me?.user?.fullName}</span>
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

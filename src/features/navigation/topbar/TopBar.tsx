import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import React from 'react'
import { GearFill } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { useGetMeQuery } from 'types/generated/graphql'

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
  transition: all 200ms;

  :hover {
    background-color: ${({ theme }) => theme.backgroundTransparent};
  }
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
`

export const TopBar: React.FC<{}> = () => {
  const history = useHistory()
  const { data } = useGetMeQuery()

  if (!data) {
    return null
  }

  return (
    <Wrapper>
      <div>
        <Username
          direction="row"
          justify="flex-end"
          align="center"
          onClick={() => history.push('/profile')}
        >
          <span>{data.me.user.fullName}</span>
          <CircleButton style={{ marginLeft: '1em' }}>
            <GearFill />
          </CircleButton>
        </Username>
      </div>
    </Wrapper>
  )
}

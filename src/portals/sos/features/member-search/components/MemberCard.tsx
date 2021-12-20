import styled from '@emotion/styled'
import React, { useState } from 'react'
import chroma from 'chroma-js'
import { Flex, Spacing } from '@hedvig-ui'

const Card = styled.div<{ extended: boolean }>`
  cursor: ${({ extended }) => (extended ? 'default' : 'pointer')};

  background-color: ${({ theme }) =>
    chroma(theme.foreground).brighten(0.5).hex()};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: height 200ms ease-in-out;
  border: 1px solid ${({ theme }) => theme.foreground};
  padding: 1.5rem;
  height: ${({ extended }) => (extended ? '22rem' : '12rem')};
  border-radius: 0.75rem;
  width: 25rem;

  #member-name {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.accentContrast};
  }

  #member-id {
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.accentContrast).darken(1).hex()};
  }

  #member-extra {
    transition: all 200ms ease-in-out;
    height: ${({ extended }) => (extended ? '100%' : 0)};
    font-size: 1rem;
    opacity: ${({ extended }) => (extended ? '1' : '0')};
    color: ${({ theme }) => theme.accentContrast};
    padding-top: 2rem;
  }

  #member-market {
    font-size: 1rem;
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) =>
      chroma(theme.background).alpha(0.2).hex()};

    color: ${({ theme }) => theme.accentContrast};
  }
`

const Group = styled.div`
  border-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
  background-color: ${({ theme }) => chroma(theme.background).alpha(0.2).hex()};
`

const ShowLess = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.accentContrast};
  text-decoration: underline;
  font-size: 0.95rem;
`

export const MemberCard: React.FC<{
  fullName: string
  memberId: string
  email: string
  phoneNumber: string
}> = ({ fullName, memberId, email, phoneNumber }) => {
  const [extended, setExtended] = useState(false)

  return (
    <Card extended={extended} onClick={() => setExtended(true)}>
      <div>
        <div id="member-name">{fullName}</div>
        <div id="member-id">{memberId}</div>
      </div>
      <div id="member-extra">
        <Group>
          <div>Crafoords Väg 14</div>
          <div>113 24 Stockholm</div>
        </Group>
        <Spacing top="small" />
        <Group>
          <div>{phoneNumber}</div>
          <div>{email}</div>
        </Group>
      </div>
      <Spacing top="small" />
      <Flex justify="space-between" align="flex-end">
        <div id="member-market">🇩🇰 Denmark</div>
        {extended && (
          <ShowLess
            onClick={(e) => {
              e.stopPropagation()
              setExtended(false)
            }}
          >
            Show less
          </ShowLess>
        )}
      </Flex>
    </Card>
  )
}

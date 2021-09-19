import styled from '@emotion/styled'
import { FadeIn, Flex, Label, Placeholder } from '@hedvig-ui'
import { colorsV3 } from '@hedviginsurance/brand'
import { differenceInYears, parseISO } from 'date-fns'
import React from 'react'
import { useHistory } from 'react-router'
import { ClaimState, useGetMemberInfoQuery } from 'types/generated/graphql'
import { splitOnUpperCase } from 'utils/text'

const MemberCard = styled(FadeIn)`
  padding: 1em;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.foreground};
  color: ${({ theme }) => theme.background};
  width: 100%;
  min-height: 180px;
  cursor: pointer;
  transition: all 200ms;

  :hover {
    background-color: ${({ theme }) =>
      theme.type === 'dark' ? colorsV3.gray300 : colorsV3.gray800};
  }
`

const ClaimItem = styled.div`
  background-color: ${({ theme }) => theme.backgroundTransparent};
  padding: 0.8em 1em;
  font-size: 0.8em;
  width: 100%;
  border-radius: 8px;
  color: ${({ theme }) => theme.semiStrongForeground};
  margin-top: 0.5em;
  cursor: pointer;
  transition: all 200ms;

  :first-of-type {
    margin-top: 0.2em;
  }

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
  }
`

const MemberId = styled.span`
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const MemberSummary: React.FC<{ memberId: string }> = ({ memberId }) => {
  const history = useHistory()
  const { data } = useGetMemberInfoQuery({
    variables: { memberId },
  })

  if (!data) {
    return null
  }

  const { member } = data

  if (!member) {
    return null
  }

  const { birthDate, claims } = member
  const age = differenceInYears(new Date(), parseISO(birthDate))

  return (
    <>
      <MemberCard onClick={() => history.push(`/members/${memberId}`)}>
        <Flex direction="column">
          <Flex align={'center'} justify={'space-between'}>
            <span style={{ fontSize: '1.8em' }}>
              {member?.firstName ?? ''} {member?.lastName ?? ''}
            </span>
            <span
              style={{
                fontSize: '0.8em',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.3em 0.6em',
              }}
            >
              {age} years
            </span>
          </Flex>
          <MemberId>{memberId}</MemberId>
        </Flex>
      </MemberCard>
      {!!claims.length && (
        <FadeIn style={{ marginTop: '2.0em', width: '100%' }}>
          <Label style={{ fontSize: '0.9em' }}>Open claims</Label>
          <Flex direction={'column'}>
            {claims
              .filter(
                (claim) =>
                  claim.state === (ClaimState.Open || ClaimState.Reopened),
              )
              .map((claim) => (
                <ClaimItem
                  onClick={() => history.push(`/claims/${claim.id}`)}
                  key={claim.id}
                >
                  <Flex justify={'space-between'} align={'center'}>
                    <div>
                      25 September, 2021
                      <br />
                      <span style={{ fontSize: '0.8em' }}>16:03</span>
                    </div>
                    <span style={{ paddingRight: '0.5em' }}>
                      {claim.type?.__typename ? (
                        splitOnUpperCase(claim.type.__typename.toString())
                      ) : (
                        <Placeholder>No claim type</Placeholder>
                      )}
                    </span>
                  </Flex>
                </ClaimItem>
              ))}
          </Flex>
        </FadeIn>
      )}
    </>
  )
}

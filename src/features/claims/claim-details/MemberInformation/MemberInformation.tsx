import styled from '@emotion/styled'
import { CardContent, Copyable, Spacing, Tabs } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import { MemberGeneralView } from 'features/claims/claim-details/MemberInformation/components/MemberGeneralView'
import { useCommandLine } from 'features/commands/use-command-line'
import { getMemberFlag } from 'features/member/utils'
import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useGetMemberInfoQuery } from 'types/generated/graphql'

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(0.5)
      .alpha(0.15)
      .hex()};
  border-radius: 0.5rem;
  padding: 1rem;
  height: 10rem;

  div {
    h3 {
      font-size: 1.3rem;
      margin: 0;
      padding: 0 0 0.25rem;
    }
    a {
      font-size: 1rem;

      :hover {
        color: ${({ theme }) =>
          chroma(theme.accent)
            .brighten(1)
            .hex()};
      }
  }
`

export const MemberInformation: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const { data } = useGetMemberInfoQuery({ variables: { memberId } })
  const { registerActions } = useCommandLine()
  const history = useHistory()

  const member = data?.member

  registerActions([
    {
      label: `Go to member`,
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        history.push(`/members/${memberId}`)
      },
    },
  ])

  if (!member) {
    return null
  }

  const totalClaimsWithoutDuplicates = member.claims.reduce(
    (count, claim) => (claim.claimType !== 'DUPLICATE' ? count + 1 : count),
    0,
  )

  return (
    <CardContent>
      <MemberCard>
        <div>
          <h3>{member.firstName + ' ' + member.lastName}</h3>
          <Copyable
            copyLabel={{ before: 'Copy link' }}
            onClick={() => {
              copy(`${window.location.origin}/members/${memberId}`)
            }}
          >
            <Link to={`/members/${memberId}`}>{memberId}</Link>{' '}
          </Copyable>
        </div>
        <div>
          {getMemberFlag(member.contractMarketInfo, member.pickedLocale)}
        </div>
      </MemberCard>
      <Spacing top="small" />
      <Tabs
        list={[
          {
            active: true,
            title: 'General',
            action: () => void 0,
          },
          {
            active: false,
            title: `Claims (${totalClaimsWithoutDuplicates})`,
            action: () => void 0,
          },
        ]}
      />
      <Spacing top="small" />
      <MemberGeneralView memberId={memberId} claimId={claimId} />
    </CardContent>
  )
}

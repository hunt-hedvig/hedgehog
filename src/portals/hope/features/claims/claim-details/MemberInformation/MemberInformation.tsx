import styled from '@emotion/styled'
import { CardContent, Spacing, Tabs } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import { MemberClaimsView } from 'portals/hope/features/claims/claim-details/MemberInformation/components/MemberClaimsView'
import { MemberGeneralView } from 'portals/hope/features/claims/claim-details/MemberInformation/components/MemberGeneralView'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { getMemberFlag } from 'portals/hope/features/member/utils'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useGetMemberInfoQuery } from 'types/generated/graphql'

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(0.5).alpha(0.25).hex()};
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
        color: ${({ theme }) => chroma(theme.accent).brighten(1).hex()};
      }
  }
`

export const MemberInformation: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const [tab, setTab] = useState<'general' | 'claims'>('general')
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
    {
      label: 'Copy member ID',
      keys: [Keys.Option, Keys.I],
      onResolve: () => {
        copy(memberId)
        toast.success('Member ID copied to clipboard')
      },
    },
    {
      label: 'Copy member link',
      keys: [Keys.Option, Keys.L],
      onResolve: () => {
        copy(`${window.location.origin}/members/${memberId}`)
        toast.success('Member link copied to clipboard')
      },
    },
  ])

  if (!member) {
    return null
  }

  const totalClaimsWithoutDuplicates = member.claims.reduce(
    (count, claim) => (claim.outcome !== 'DUPLICATE' ? count + 1 : count),
    0,
  )

  return (
    <CardContent>
      <MemberCard>
        <div>
          <h3>{member.firstName + ' ' + member.lastName}</h3>
          <Link to={`/members/${memberId}`}>{memberId}</Link>{' '}
        </div>
        <div>
          {getMemberFlag(member.contractMarketInfo, member.pickedLocale)}
        </div>
      </MemberCard>
      <Spacing top="small" />
      <Tabs
        list={[
          {
            active: tab === 'general',
            title: 'General',
            action: () => setTab('general'),
          },
          {
            active: tab === 'claims',
            title: `Claims (${totalClaimsWithoutDuplicates})`,
            action: () => setTab('claims'),
          },
        ]}
      />
      <Spacing top="small" />
      {tab === 'general' && (
        <MemberGeneralView memberId={memberId} claimId={claimId} />
      )}
      {tab === 'claims' && (
        <MemberClaimsView member={member} claimId={claimId} />
      )}
    </CardContent>
  )
}

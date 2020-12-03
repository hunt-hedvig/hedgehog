import { Claim } from 'api/generated/graphql'
import { LinkRow } from 'components/shared'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import isValidDate from 'date-fns/isValid'
import { withFadeIn } from 'hedvig-ui/animations/fade-in'
import React from 'react'
import styled from 'react-emotion'
import { Table, TableRowProps } from 'semantic-ui-react'
import { history } from 'store'
import { getMemberIdColor } from 'utils/member'
import { formatMoney } from 'utils/money'

const MemberIdCell = styled(Table.Cell)<{ memberId: string }>(
  ({ memberId }) => ({
    borderLeft: `7px solid ${getMemberIdColor(memberId)} !important`,
  }),
)

const FadeInLinkRow = withFadeIn<TableRowProps>(LinkRow)

const linkClickHandler = (id: string, userId: string) => {
  history.push(`/claims/${id}/members/${userId}`)
}

export const ListItem: React.FC<{
  item: Claim
  index: number
  active: boolean
}> = ({ item, index, active }) => {
  const date = parseISO(item.registrationDate)
  const formattedDate = isValidDate(date)
    ? formatDate(date, 'dd MMMM yyyy HH:mm')
    : '-'

  const memberId = item.member?.memberId
  const claimId = item.id

  if (!memberId || !claimId) {
    return null
  }

  return (
    <FadeInLinkRow
      delay={`${index * 50}ms`}
      onClick={() => linkClickHandler(claimId, memberId)}
      active={active}
    >
      <MemberIdCell memberId={memberId}>{memberId}</MemberIdCell>
      <Table.Cell>{formattedDate}</Table.Cell>
      <Table.Cell>{item.type?.__typename}</Table.Cell>
      <Table.Cell>{item.state}</Table.Cell>
      <Table.Cell>{item.reserves && formatMoney(item.reserves)}</Table.Cell>
    </FadeInLinkRow>
  )
}

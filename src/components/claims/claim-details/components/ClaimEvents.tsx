import {
  List as MuiList,
  ListItem as MuiListItem,
  withStyles,
} from '@material-ui/core'
import { useClaimEventsQuery } from 'api/generated/graphql'
import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { format, parseISO } from 'date-fns'
import { Card, CardContent } from 'hedvig-ui/card'
import { Spinner } from 'hedvig-ui/sipnner'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'

interface Props {
  claimId: string
}

const ListItem = withStyles({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiListItem)

export const ClaimEvents: React.FC<Props> = ({ claimId }) => {
  const {
    data: claimEventsData,
    loading: loadingClaimEvents,
    error: queryError,
  } = useClaimEventsQuery({
    variables: { claimId },
  })

  return (
    <Card span={1}>
      <CardContent>
        <PaperTitle
          title={'Events'}
          badge={
            queryError
              ? {
                  icon: BugFill,
                  status: 'danger',
                  label: 'Internal Error',
                }
              : null
          }
        />

        {loadingClaimEvents && <Spinner />}

        <MuiList>
          {claimEventsData?.claim?.events.filter(Boolean).map((event) => (
            <ListItem key={event.date}>
              {format(parseISO(event.date), 'yyyy-MM-dd HH:mm:ss')}:{' '}
              {event.text}
            </ListItem>
          ))}
        </MuiList>
      </CardContent>
    </Card>
  )
}

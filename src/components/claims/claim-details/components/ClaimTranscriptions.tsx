import {
  List as MuiList,
  ListItem as MuiListItem,
  Typography as MuiTypography,
  withStyles,
} from '@material-ui/core'
import { useClaimPageQuery } from 'api/generated/graphql'

import React from 'react'

import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { Card, CardContent } from 'hedvig-ui/card'
import { BugFill } from 'react-bootstrap-icons'

interface Props {
  claimId: string
}

const ListItem = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiListItem)

const ClaimTranscription = withStyles({
  root: {
    fontSize: '1rem',
    maxWidth: '80%',
  },
})(MuiTypography)

const ClaimTranscriptionMetaData = withStyles({
  root: {
    fontSize: '0.875rem',
  },
})(MuiTypography)

const ClaimTranscriptions: React.FC<Props> = ({ claimId }) => {
  const {
    data: claimTranscriptionsData,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  if (!claimTranscriptionsData?.claim?.transcriptions.length) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <PaperTitle
          title={'Transcription'}
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

        <MuiList>
          {claimTranscriptionsData?.claim?.transcriptions?.map(
            (transcription) => (
              <ListItem key={transcription.text}>
                <ClaimTranscription component="p">
                  {transcription.text}
                </ClaimTranscription>
                <MuiList>
                  <ClaimTranscriptionMetaData component="span">
                    Confidence: {transcription.confidenceScore}
                    <br /> Language code: {transcription.languageCode}
                  </ClaimTranscriptionMetaData>
                </MuiList>
              </ListItem>
            ),
          )}
        </MuiList>
      </CardContent>
    </Card>
  )
}

export { ClaimTranscriptions }

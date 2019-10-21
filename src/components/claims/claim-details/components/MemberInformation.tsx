import { formatDistance } from 'date-fns'
import { FraudulentStatus } from 'lib/fraudulentStatus'
import { formatMoneySE } from 'lib/intl'
import * as React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import {
  Ban,
  Checkmark,
  Cross,
  QuestionMark,
  RedQuestionMark,
  ThumpsUp,
} from '../../../icons'

import { Paper } from '../../../shared/Paper'

export enum SanctionStatus {
  Undetermined = 'Undetermined',
  NoHit = 'NoHit',
  PartialHit = 'PartialHit',
  FullHit = 'FullHit',
}

interface MemberInformationProps {
  member: {
    memberId: string
    signedOn: Date
    firstName: string
    lastName: string
    personalNumber: string
    address: string
    postalNumber: string
    city: string
    directDebitStatus: {
      activated: boolean
    }
    fraudulentStatus: string
    sanctionStatus: SanctionStatus
    numberFailedCharges: {
      numberFailedCharges: number
    }
    account: {
      totalBalance: {
        amount: number
        currency: string
      }
    }
  }
}

const SanctionStatusIcon: React.SFC<{ status: SanctionStatus }> = ({
  status,
}) => {
  switch (status) {
    case SanctionStatus.Undetermined:
      return <QuestionMark />
    case SanctionStatus.NoHit:
      return <ThumpsUp />
    case SanctionStatus.PartialHit:
      return <RedQuestionMark />
    case SanctionStatus.FullHit:
      return <Ban />
    default:
      throw new Error('SanctionStatusPicker failed to map the status')
  }
}

const MemberName = styled('h2')({
  marginTop: 0,
  marginBottom: '2rem',
})

const MemberInformation: React.SFC<MemberInformationProps> = ({
  member: {
    memberId,
    signedOn,
    firstName,
    lastName,
    personalNumber,
    address,
    postalNumber,
    city,
    directDebitStatus: { activated },
    fraudulentStatus,
    sanctionStatus,
    numberFailedCharges: { numberFailedCharges },
    account: { totalBalance },
  },
}) => (
  <Paper>
    <h3>Member Information</h3>
    <MemberName>
      {firstName} {lastName}
    </MemberName>
    <p>
      <b>Id:</b> <Link to={`/members/${memberId}`}>{memberId}</Link>
    </p>
    <p>
      <b>Signed:</b> {formatDistance(signedOn, new Date(), { addSuffix: true })}
    </p>
    <p>
      <b>Personal Number:</b> {personalNumber}
    </p>
    <p>
      <b>Address:</b> {address}, {postalNumber} {city}
    </p>
    <p>
      <b>Failed Charge Spree:</b> {numberFailedCharges} charge(s) in a row
    </p>
    <p>
      <b>Total Debt (Minimum):</b> {formatMoneySE(totalBalance)}
    </p>
    <p>
      <b>Direct Debit:</b> {activated ? <Checkmark /> : <Cross />}
    </p>
    <p style={{ marginTop: '-7px' }}>
      <b>Fraudulent Status:</b>{' '}
      <span style={{ fontSize: '32px' }}>
        <FraudulentStatus stateInfo={fraudulentStatus} />
      </span>
    </p>
    <p>
      <b>Sanction Status:</b> {sanctionStatus}{' '}
      <SanctionStatusIcon status={sanctionStatus} />
    </p>
  </Paper>
)

export { MemberInformation }

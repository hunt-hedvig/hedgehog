import * as React from 'react'

import { Checkmark, Cross } from '../../../icons'
import { CustomPaper } from './Styles'

interface MemberInformationProps {
  member: {
    firstName: string
    lastName: string
    personalNumber: string
    address: string
    postalNumber: string
    city: string
    directDebitStatus: {
      activated: boolean
    }
  }
}

const MemberInformation: React.SFC<MemberInformationProps> = ({ member: { firstName, lastName, personalNumber, address, postalNumber, city, directDebitStatus: { activated } } }) => (
  <CustomPaper>
    <h3>Member Information</h3>
    <p>Name: {firstName} {lastName}</p>
    <p>Personal Number: {personalNumber}</p>
    <p>Address: {address}, {postalNumber} {city}</p>
    <p>Direct Debit: {activated ? <Checkmark /> : <Cross />}</p>
  </CustomPaper>
)

export { MemberInformation }

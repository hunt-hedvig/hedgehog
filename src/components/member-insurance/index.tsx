import * as React from 'react'
import { Mount } from 'react-lifecycle-components/dist'
import { Header } from 'semantic-ui-react'
import {
  MemberInsuranceSearchRequest,
  MemberInsuranceStore,
} from '../../store/types/memberInsuranceTypes'
import { MemberInsuranceFilter } from './member-insurance-filter/MemberInsuranceFilter'
import { MemberInsuranceList } from './member-insurance-list/MemberInsuranceList'

export interface MemberInsuranceProps {
  memberInsurance: MemberInsuranceStore
  searchMemberInsRequest: (req: Partial<MemberInsuranceSearchRequest>) => void
}

export const MemberInsurance: React.SFC<MemberInsuranceProps> = ({
  memberInsurance,
  searchMemberInsRequest,
}) => (
  <Mount on={() => searchMemberInsRequest({})}>
    <>
      <Header size="huge"> Member Insurance </Header>
      <MemberInsuranceFilter
        memberInsurance={memberInsurance}
        searchMemberInsRequest={searchMemberInsRequest}
      />
      <MemberInsuranceList
        memberInsurance={memberInsurance}
        searchMemberInsRequest={searchMemberInsRequest}
      />
    </>
  </Mount>
)

import { MemberInsurance } from 'components/member-insurance'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import actions from 'store/actions'
import styled from 'styled-components'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto 50px;
`

const MemberInsurancePage = (props) => (
  <ListPage>
    <MemberInsurance {...props} />
  </ListPage>
)

const mapStateToProps = ({ memberInsurance }) => ({ memberInsurance })

export default withRouter(
  connect(
    mapStateToProps,
    {
      ...actions.memberInsuranceActions,
    },
  )(MemberInsurancePage),
)

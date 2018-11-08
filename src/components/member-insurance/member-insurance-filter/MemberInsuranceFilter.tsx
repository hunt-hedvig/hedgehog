import { ActionMap, Container } from 'constate'
import { memberState } from 'lib/selectOptions'
import * as React from 'react'
import { Button, Dropdown, Form, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import initialStoreState from '../../../store/initialState'
import {
  MemberInsuranceSearchRequest,
  MemberInsuranceStore,
} from '../../../store/types/memberInsuranceTypes'

const MembersFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const ResetButton = styled(Button)`
  &&& {
    margin-top: 10px;
  }
`

export interface MemberInsuranceFilterProps {
  memberInsurance: MemberInsuranceStore
  searchMemberInsRequest: (req: Partial<MemberInsuranceSearchRequest>) => void
}

interface State {
  searchQuery: string
}

interface Actions {
  updateQuery: (e, data) => void
  resetQuery: () => void
}

const actions: ActionMap<State, Actions> = {
  updateQuery: (e, { value }) => () => ({ searchQuery: value }),
  resetQuery: () => () => ({
    searchQuery: initialStoreState.memberInsurance.searchFilter.query,
  }),
}

export const MemberInsuranceFilter: React.SFC<MemberInsuranceFilterProps> = ({
  memberInsurance,
  searchMemberInsRequest,
}) => (
  <Container<State, Actions>
    initialState={{ searchQuery: memberInsurance.searchFilter.query }}
    actions={actions}
  >
    {({ updateQuery, resetQuery, searchQuery }) => {
      const doSearch = () =>
        searchMemberInsRequest({ query: searchQuery, page: 0 })

      const doResetQuery = () => {
        resetQuery()
        searchMemberInsRequest(initialStoreState.memberInsurance.searchFilter)
      }

      return (
        <>
          <MembersFilterContainer>
            <Input
              loading={memberInsurance.requesting}
              placeholder="Search..."
              iconPosition="left"
              onChange={updateQuery}
              onKeyPress={(e) => e.key === 'Enter' && doSearch()}
              action={{ icon: 'search', onClick: doSearch }}
              value={searchQuery}
            />
            <Form.Group>
              <label>State: </label>
              <Dropdown
                onChange={(e, { value }) =>
                  searchMemberInsRequest({ state: value, page: 0 })
                }
                options={memberState}
                selection
                value={memberInsurance.searchFilter.state}
              />
            </Form.Group>
          </MembersFilterContainer>
          <ResetButton onClick={doResetQuery}>reset</ResetButton>
        </>
      )
    }}
  </Container>
)

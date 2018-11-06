import { memberState } from 'lib/selectOptions'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Button, Dropdown, Form, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import { searchMemberInsRequest } from '../../../store/actions/memberInsuranceActions'
import { MemberStatus } from '../../../store/storeTypes'
import {
  MemberInsuranceSearchRequest,
  MemberInsuranceStore,
  ProductState,
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

export interface MemberInsuranceFilterState {
  searchQuery: string
}

export default class MemberInsuranceFilter extends React.Component<
  MemberInsuranceFilterProps,
  MemberInsuranceFilterState
> {
  constructor(props: MemberInsuranceFilterProps) {
    super(props)
    this.state = {
      searchQuery: '',
    }
  }

  public doSearch = () => {
    const { searchQuery } = this.state
    searchMemberInsRequest({ query: searchQuery, page: 0 })
  }

  public keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.doSearch()
    }
  }

  public inputChangeHandler = (e, { value }) => {
    this.setState({ searchQuery: value })
  }

  public proudctStateChangeHandler = (e, { value }) => {
    searchMemberInsRequest({ state: value, page: 0 })
  }

  public resetSearch = () => {
    this.setState({
      searchQuery: '',
    })
    this.doSearch()
  }

  public componentDidMount() {
    const { searchFilter } = this.props.memberInsurance
    this.setState({
      searchQuery: searchFilter.query,
    })
  }

  public render() {
    const {
      memberInsurance: { requesting, searchFilter },
    } = this.props
    return (
      <React.Fragment>
        <MembersFilterContainer>
          <Input
            loading={requesting}
            placeholder="Search..."
            iconPosition="left"
            onChange={this.inputChangeHandler}
            onKeyPress={this.keyPressHandler}
            action={{ icon: 'search', onClick: this.doSearch() }}
            value={this.state.searchQuery}
          />
          <Form.Group>
            <label>State: </label>
            <Dropdown
              onChange={this.proudctStateChangeHandler}
              options={memberState}
              selection
              value={searchFilter.state}
            />
          </Form.Group>
        </MembersFilterContainer>
        <ResetButton onClick={this.resetSearch}>reset</ResetButton>
      </React.Fragment>
    )
  }
}

import { memberState, memberStatus } from 'lib/selectOptions'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Button, Dropdown, Form, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import { MemberSearchFilter, MembersStore } from '../../../store/storeTypes'

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

export interface MembersBackendFilterProps {
  members: MembersStore
  search: (filter: MemberSearchFilter) => void
  resetSearch: () => void
}

interface MembersBackendFilterState {
  searchValue: string
}

export default class MembersBackendFilter extends React.Component<
  MembersBackendFilterProps,
  MembersBackendFilterState
> {
  constructor(props: MembersBackendFilterProps) {
    super(props)
    this.state = {
      searchValue: '',
    }
  }

  public keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.searchRequest()
    }
  }

  public inputChangeHandler = (e, { value }) => {
    this.setState({ searchValue: value })
  }

  public searchRequest = () => {
    const { searchValue } = this.state
    const searchFilter = this.props.members.searchFilter
    this.props.search({ ...searchFilter, query: searchValue })
  }

  public filterChangeHandler = (e, { value }) => {
    const searchValue = this.state.searchValue
    const searchFilter = this.props.members.searchFilter
    this.props.search({ ...searchFilter, query: searchValue, status: value })
  }

  public resetSearch = () => {
    this.setState({ searchValue: '' })
    this.props.resetSearch()
  }

  public componentDidMount() {
    const {
      members: { searchFilter },
    } = this.props
    this.setState({ searchValue: searchFilter.query })
  }

  public render() {
    const { members } = this.props
    return (
      <React.Fragment>
        <MembersFilterContainer>
          <Input
            loading={members.requesting}
            placeholder="Search..."
            iconPosition="left"
            onChange={this.inputChangeHandler}
            onKeyPress={this.keyPressHandler}
            action={{ icon: 'search', onClick: this.searchRequest }}
            value={this.state.searchValue}
          />
          <Form.Group>
            <label>Status: </label>
            <Dropdown
              onChange={this.filterChangeHandler}
              options={memberStatus}
              selection
              value={members.searchFilter.status}
            />
          </Form.Group>
        </MembersFilterContainer>
        <ResetButton onClick={this.resetSearch}>reset</ResetButton>
      </React.Fragment>
    )
  }
}

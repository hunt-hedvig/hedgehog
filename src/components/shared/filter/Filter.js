import { filterList } from 'lib/helpers'
import PropTypes from 'prop-types'
import React from 'react'
import { Dropdown } from 'semantic-ui-react'

export default class Filter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filters: [],
    }
  }

  filterChangeHandler = (e, { value }) => {
    const { filterChange, list, fieldName } = this.props
    const filteredList = filterList(value, list, fieldName)
    filterChange(value, filteredList)
  }

  componentDidMount() {
    const { options, activeFilter } = this.props
    this.setState({ filters: options })
    this.filterChangeHandler(null, { value: activeFilter })
  }

  componentWillReceiveProps(nextProps) {
    const { activeFilter, list } = this.props
    if (nextProps.list.length !== list.length) {
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        this.filterChangeHandler(null, { value: activeFilter })
      }, 0)
    }
  }

  render() {
    const { activeFilter } = this.props
    return (
      <React.Fragment>
        <label>Filter: </label>
        <Dropdown
          onChange={this.filterChangeHandler}
          options={this.state.filters}
          selection
          value={activeFilter}
        />
      </React.Fragment>
    )
  }
}

Filter.propTypes = {
  filterChange: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  list: PropTypes.array.isRequired,
  fieldName: PropTypes.string.isRequired,
}

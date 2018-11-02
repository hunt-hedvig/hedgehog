import config from 'api/config'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import MonthPickerInput from 'react-month-picker-input'
import { Button, Dropdown, Header, Icon } from 'semantic-ui-react'
import styled from 'styled-components'

const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`

const bdxOptions = [
  {
    text: 'Regular',
    value: 'Regular',
  },
  {
    text: 'Student',
    value: 'Student',
  },
]

export default class Bordereau extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment().format('YYYY-MM'),
      defaultYear: Number(moment().format('YYYY')),
      defaultMonth: Number(moment().format('MM')) - 1,
      isStudent: false,
    }
  }

  public onDateChange = (maskedValue, selectedYear, selectedMonth) => {
    // The range of the selectedMonth from MonthPickerInput is 0-11
    const month = (+selectedMonth + 1).toString()

    if (month.length === 1) {
      this.setState({ date: `${selectedYear}-0${month}` })
    } else {
      this.setState({ date: `${selectedYear}-${month}` })
    }
  }

  public handleClick = (e, data) => {
    if (data.value === 'Student') {
      this.setState({ isStudent: true })
    } else {
      this.setState({ isStudent: false })
    }
  }

  public render() {
    return (
      <React.Fragment>
        <HeaderContainer>
          <Header dividing={true} textAlign="center" as="h3">
            Dear User, we would like to welcome you to this fine page.
            <br /> The page that gives you the ability to download the monthly
            BDX report.
            <br />I know its awesome.
            <br />
            Please select the month, the bdx type
            <br />
            and SMASH the button below in order to download it.
            <br /> Cheers!
          </Header>
        </HeaderContainer>
        <DatePickerContainer>
          <MonthPickerInput
            onChange={this.onDateChange}
            year={this.state.defaultYear}
            month={this.state.defaultMonth}
            closeOnSelect={true}
          />
        </DatePickerContainer>
        {this.state.date && (
          <React.Fragment>
            <DropdownContainer>
              <Dropdown
                placeholder="Select bdx type"
                selection
                options={bdxOptions}
                onChange={this.handleClick}
              />
            </DropdownContainer>

            <ButtonContainer>
              <a
                href={` ${config.baseUrl}${
                  config.reports.getBDX.url
                }?year=${this.state.date.substr(
                  0,
                  4,
                )}&month=${this.state.date.substr(5, 2)}&isStudent=${
                  this.state.isStudent
                }`}
                target="_blank"
              >
                <Button icon disabled={!this.state.date} labelposition="left">
                  <Icon name="download" />
                  Get BDX now!
                </Button>
              </a>
            </ButtonContainer>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

Bordereau.propTypes = {
  bdxRequest: PropTypes.func.isRequired,
}

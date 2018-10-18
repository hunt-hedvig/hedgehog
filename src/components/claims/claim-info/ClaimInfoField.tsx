import claimInputs from 'components/claims/claim-info/ClaimInputs'
import * as types from 'lib/claimFieldsTypes'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Checkbox, Form } from 'semantic-ui-react'
import styled from 'styled-components'

const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 500px;
  min-height: 60px;
`

const InputContainer = styled(Form)`
  width: 300px;
  margin-left: auto;
`

export default class ClaimInfoField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputIsVisible: false,
    }
  }

  public toggleInput = () => {
    this.setState(
      {
        inputIsVisible: !this.state.inputIsVisible,
      },
      () => {
        if (!this.state.inputIsVisible) {
          const {
            field: { name },
            cleanupField,
          } = this.props
          cleanupField(name)
        }
      },
    )
  }

  public getInput = (type = 'text') => {
    const { field, inputHandler } = this.props
    const input = claimInputs[type](inputHandler, false, field.value)
    return <InputContainer>{input}</InputContainer>
  }

  public componentWillMount() {
    if (this.props.field.value) {
      this.setState({ inputIsVisible: true })
    }
  }

  public render() {
    const { field } = this.props
    const { inputIsVisible } = this.state
    return (
      <React.Fragment>
        <FieldRow>
          <Checkbox
            label={field.name}
            onChange={this.toggleInput}
            disabled={!!field.value}
            checked={inputIsVisible}
          />
          {inputIsVisible ? this.getInput(types[field.type]) : null}
        </FieldRow>
      </React.Fragment>
    )
  }
}

ClaimInfoField.propTypes = {
  field: PropTypes.object.isRequired,
  inputHandler: PropTypes.func.isRequired,
  cleanupField: PropTypes.func.isRequired,
}

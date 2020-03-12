import { colors } from '@hedviginsurance/brand'
import DateInput from 'components/shared/inputs/DateInput'
import { formatDistance, parse } from 'date-fns'
import { formatMoneySE } from 'lib/intl'
import { ACTIVATION_DATE, CANCELLATION_DATE } from 'lib/messageTypes'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'react-emotion'
import { Button, Header, Icon, Radio } from 'semantic-ui-react'
import { CreateQuote } from './insurance-tab/create-quote'
import InsuranceTrace from './insurance-trace/InsuranceTrace'

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
})
const Box = styled('div')({
  padding: 16,
  width: '50%',
})
const ActionBox = styled(Box)({
  margin: 8,
  width: 'calc(50% - 16px)',
  border: '1px solid ' + colors.DARK_GRAY,
  borderRadius: 5,
})
const ActionHeadline = styled('h3')({
  marginBottom: 5,
})
const DebugBox = styled(ActionBox)({
  opacity: 0.8,
  width: 'calc(100% - 16px)',
})
const SpacedBottom = styled('div')({
  paddingBottom: 8,
})
const PropList = styled('dl')({
  dt: {
    float: 'left',
    display: 'inline-block',
    '&:after': {
      content: '": "',
    },
    paddingRight: 8,
  },

  dd: {
    padding: 0,
    display: 'block',
    margin: 0,
    marginBottom: 8,
    fontWeight: 'bold',
  },
})
const Name = styled('h1')({
  color: colors.BLACK_PURPLE,
  fontSize: 18,
  marginBottom: 0,
})
const Address = styled('address')({
  color: colors.BLACK_PURPLE,
  fontSize: 20,
  lineHeight: 1.2,
})
const PriceTitle = styled('div')({
  color: colors.PINK,
})
const Price = styled('div')({
  color: colors.PINK,
  fontSize: 30,
})
const HedvigStyledButton = styled('button')({
  background: colors.PURPLE,
  color: '#fff',
  border: 0,
  fontSize: 'inherit',
  borderRadius: 40,
  padding: '12px 18px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  margin: 0,
  display: 'inline-block',

  '&:hover, &:focus': {
    color: '#fff',
  },
})
const ButtonLink = HedvigStyledButton.withComponent('a')
const FileButton = styled(HedvigStyledButton)({
  marginLeft: 8,
}).withComponent('label')

const timeStringToDistance = (timeString) =>
  formatDistance(
    parse(timeString.replace(/\..*$/, ''), "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    new Date(),
    { addSuffix: true },
  )

export default class InsuranceTab extends React.Component {
  state = {
    activationDatePickerEnabled: false,
    cancellationDatePickerEnabled: false,
  }
  fileInputRef = React.createRef()

  hasHouseInsurance = () => {
    const { data } = this.props.insurance
    return data.insuranceType === 'HOUSE'
  }

  render() {
    const {
      insurance: { data },
    } = this.props
    let activeDate
    let cancellationDate
    let fields
    let traceData

    if (data) {
      activeDate = activeDate ? activeDate : data.insuranceActiveFrom
      cancellationDate = cancellationDate
        ? cancellationDate
        : data.insuranceActiveTo
      const {
        insuranceActiveFrom,
        insuranceActiveTo,
        insuredAtOtherCompany,
        cancellationEmailSent,
        traceProduct,
        ...filteredFields
      } = data

      fields = filteredFields
      traceData = traceProduct
    }

    return fields ? (
      <Wrapper>
        <Box>
          <Name>
            {fields.memberFirstName} {fields.memberLastName}
          </Name>
          <Address>
            {fields.street}
            <br />
            {fields.zipCode} {fields.city}
          </Address>
          <PropList>
            <dt>Type</dt>
            <dd>{fields.insuranceType}</dd>
            <dt>Persons in household</dt>
            <dd>{fields.personsInHouseHold}</dd>
            <dt>Living space</dt>
            <dd>
              {fields.livingSpace} m<sup>2</sup>
            </dd>
            {this.hasHouseInsurance() ? (
              <>
                <dt>Ancillary area</dt>
                <dd>
                  {fields.ancillaryArea} m<sup>2</sup>
                </dd>
                <dt>Year of construction</dt>
                <dd>{fields.yearOfConstruction}</dd>
                <dt>Number of bathrooms</dt>
                <dd>{fields.numberOfBathrooms}</dd>
                <dt>Is subleted</dt>
                <dd>{fields.isSubleted ? 'Yes' : 'No'}</dd>
                {fields.extraBuildings.map((extraBuilding, index) => (
                  <React.Fragment key={extraBuilding.id}>
                    <dt>Extra building {index + 1}</dt>
                    <dd>
                      {extraBuilding.displayName} {extraBuilding.area} m
                      <sup>2</sup> (
                      {extraBuilding.hasWaterConnected
                        ? 'has water connected'
                        : 'no water connected'}
                      )
                    </dd>
                  </React.Fragment>
                ))}
              </>
            ) : null}
          </PropList>
        </Box>
        <Box>
          <PriceTitle>Current Total Price</PriceTitle>
          <Price>
            {formatMoneySE({
              amount: fields.currentTotalPrice,
              currency: 'SEK',
            })}
          </Price>
          <PropList>
            <dt>Status</dt>
            <dd>{fields.insuranceStatus}</dd>
            <dt>State</dt>
            <dd>{fields.insuranceState}</dd>
            <dt>Signed</dt>
            <dd>
              {fields.signedOn ? (
                <>
                  {fields.signedOn.replace(/\..*$/, '')} (
                  {timeStringToDistance(fields.signedOn)})
                </>
              ) : (
                'Not signed'
              )}
            </dd>
            <dt>Current Insurer</dt>
            <dd>{fields.currentInsurer || 'N/A'}</dd>
          </PropList>
        </Box>
        <ActionBox>
          <ActionHeadline>Insurance Mandate</ActionHeadline>
          <ButtonLink
            target="_blank"
            href={`/api/member/mandate/${fields.memberId}`}
          >
            Download
          </ButtonLink>
        </ActionBox>
        <ActionBox>
          <ActionHeadline>Insured at other company</ActionHeadline>
          <Radio
            toggle
            checked={fields.insuredAtOtherCompany}
            onChange={this.changeCompanyStatus}
            disabled={this.props.insurance.requesting}
          />
        </ActionBox>
        <ActionBox>
          <ActionHeadline>Insurance certificate</ActionHeadline>
          {fields.certificateUploaded ? (
            <>
              <ButtonLink target="_blank" href={fields.certificateUrl}>
                View existing
              </ButtonLink>
              <input
                type="file"
                name="certFile"
                id="certFile"
                multiple={false}
                onChange={this.handleCertificateUploadedEvent(fields.memberId)}
                style={{ display: 'none' }}
                ref={this.fileInputRef}
              />
              <FileButton htmlFor="certFile">Upload new</FileButton>
            </>
          ) : (
            <>
              <input
                type="file"
                name="certFile"
                id="certFile"
                multiple={false}
                onChange={this.handleCertificateUploadedEvent(fields.memberId)}
                style={{ display: 'none' }}
                ref={this.fileInputRef}
              />
              <FileButton htmlFor="certFile">Upload new</FileButton>
            </>
          )}
        </ActionBox>
        <ActionBox>
          <ActionHeadline>Create quote</ActionHeadline>
          <CreateQuote memberId={fields.memberId} insurance={data} />
        </ActionBox>
        <ActionBox>
          <ActionHeadline>Activation Date</ActionHeadline>
          {this.state.activationDatePickerEnabled ? (
            <>
              <SpacedBottom>
                <DateInput
                  changeHandler={this.handleDateChange}
                  changeType={ACTIVATION_DATE}
                />
              </SpacedBottom>
              <Button
                onClick={() => {
                  this.props.saveInsuranceDate(
                    this.state.activationDateValue,
                    ACTIVATION_DATE,
                    fields.memberId,
                    fields.productId,
                  )
                  this.setState({ activationDatePickerEnabled: false })
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  this.setState((state) => ({
                    activationDatePickerEnabled: !state.activationDatePickerEnabled,
                  }))
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <SpacedBottom>
                {activeDate ? activeDate.replace(/T.*$/, '') : <em>Not set</em>}
              </SpacedBottom>
              <HedvigStyledButton
                onClick={() => {
                  this.setState((state) => ({
                    activationDatePickerEnabled: !state.activationDatePickerEnabled,
                  }))
                }}
              >
                <Icon name="edit" /> Edit
              </HedvigStyledButton>
            </>
          )}
        </ActionBox>
        <ActionBox>
          <ActionHeadline>Cancellation Date</ActionHeadline>
          {this.state.cancellationDatePickerEnabled ? (
            <>
              <SpacedBottom>
                <DateInput
                  changeHandler={this.handleDateChange}
                  changeType={CANCELLATION_DATE}
                />
              </SpacedBottom>
              <Button
                onClick={() => {
                  this.props.saveInsuranceDate(
                    this.state.cancellationDateValue,
                    CANCELLATION_DATE,
                    fields.memberId,
                    fields.productId,
                  )
                  this.setState({ cancellationDatePickerEnabled: false })
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  this.setState((state) => ({
                    cancellationDatePickerEnabled: !state.cancellationDatePickerEnabled,
                  }))
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <SpacedBottom>
                {cancellationDate ? (
                  cancellationDate.replace(/T.*$/, '')
                ) : (
                  <em>Not set</em>
                )}
              </SpacedBottom>
              <HedvigStyledButton
                onClick={() => {
                  this.setState((state) => ({
                    cancellationDatePickerEnabled: !state.cancellationDatePickerEnabled,
                  }))
                }}
              >
                <Icon name="edit" /> Edit
              </HedvigStyledButton>
            </>
          )}
        </ActionBox>
        <DebugBox>
          <ActionHeadline>Debug</ActionHeadline>
          <PropList>
            <dt>Product id</dt>
            <dd>{fields.productId}</dd>
            <dt>Member id</dt>
            <dd>{fields.memberId}</dd>
          </PropList>
        </DebugBox>
        <InsuranceTrace traceData={traceData} />
      </Wrapper>
    ) : (
      <Header>No insurance info </Header>
    )
  }

  handleCertificateUploadedEvent = (memberId) => (e) => {
    const formData = new FormData()
    formData.set('file', e.target.files[0])
    this.props.sendCertificate(formData, memberId)
  }


  handleDateChange = (type, e, { value }) => {
    switch (type) {
      case ACTIVATION_DATE:
        this.setState({
          activationDateValue: moment(value).format('YYYY-MM-DD'),
        })
        break
      case CANCELLATION_DATE:
        this.setState({
          cancellationDateValue: moment(value).format('YYYY-MM-DD'),
        })
        break
      default:
        throw new Error(`No such date change type "${type}"`)
    }
  }
  changeCompanyStatus = (e, { checked }) => {
    const {
      messages: { member },
      changeCompanyStatus,
    } = this.props
    changeCompanyStatus(checked, member.memberId)
  }
}

InsuranceTab.propTypes = {
  insurance: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  saveInsuranceDate: PropTypes.func.isRequired,
  sendCancelRequest: PropTypes.func.isRequired,
}

import { colors } from '@hedviginsurance/brand'
import { colorsV2 } from '@hedviginsurance/brand/dist'
import { QUOTES_QUERY } from 'components/chat/tabs/quotes'
import gql from 'graphql-tag'
import { createCreateQuoteFromProductRequest } from 'components/chat/tabs/insurance-tab/modify-insurance'
import { Mutation } from 'react-apollo'
import DateInput from 'components/shared/inputs/DateInput'
import { WideModal } from 'components/shared/modals/WideModal'
import { formatDistance, parse } from 'date-fns'
import { getFieldName, getFieldValue } from 'lib/helpers'
import { formatMoneySE } from 'lib/intl'
import { ACTIVATION_DATE, CANCELLATION_DATE } from 'lib/messageTypes'
import * as moment from 'moment'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'
import { Button, Form, Header, Icon, Modal, Radio } from 'semantic-ui-react'
import * as uuid from 'uuid/v4'
import InsuranceTrace from './insurance-trace/InsuranceTrace'

export enum ExtraBuildingType {
  ATTEFALL = 'Attefallshus',
  SAUNA = 'Bastu',
  BOATHOUSE = 'Båthus',
  CARPORT = 'Carport',
  GUESTHOUSE = 'Gästhus',
  FRIGGEBOD = 'Friggebod',
  STOREHOUSE = 'Förråd',
  GARAGE = 'Garage',
  BARN = 'Lada',
  GAZEBO = 'Lusthus',
  SHED = 'Skjul',
  OUTHOUSE = 'Uthus',
  GREENHOUSE = 'Växthus',
  OTHER = 'Annat',
}

export interface ExtraBuilding {
  id: string
  type: ExtraBuildingType
  area: number
  hasWaterConnected: boolean
  displayName?: string
}

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
const ExtraBuildingsForm = styled('div')({
  marginBottom: '15px',
})
const SuccessMessage = styled('h3')({
  color: colorsV2.grass500,
})

const timeStringToDistance = (timeString: string) =>
  formatDistance(
    parse(timeString.replace(/\..*$/, ''), "yyyy-MM-dd'T'HH:mm:ss", new Date()),
    new Date(),
    { addSuffix: true },
  )

const CREATE_QUOTE_FROM_PRODUCT_MUTATION = gql`
  mutation CreateQuoteFromProduct(
    $memberId: ID!
    $quoteData: QuoteFromProductInput!
  ) {
    createQuoteFromProduct(memberId: $memberId, quoteData: $quoteData)
  }
`

export default class InsuranceTab extends React.Component<any, any> {
  public state = {
    modalOpen: false,
    confirmCreateQuoteModalOpen: false,
    insurance: [],
    availableSafetyIncreasers: {
      SMOKE_ALARM: 'Smoke alarm',
      FIRE_EXTINGUISHER: 'Fire extinguisher',
      SAFETY_DOOR: 'Safety door',
      GATE: 'Gate',
      BURGLAR_ALARM: 'Burglar alarm',
      NONE: 'None',
    },
    safetyIncreasers: [],
    isStudent: true,
    isSubleted: Boolean(this.props.insurance.data.isSubleted),
    activationDatePickerEnabled: false,
    cancellationDatePickerEnabled: false,
    extraBuildings: [
      ...this.props.insurance.data.extraBuildings,
    ] as ExtraBuilding[],
  }
  private fileInputRef = React.createRef<HTMLInputElement>()

  public handleOpen = () => this.setState({ modalOpen: true })

  public handleClose = () => {
    this.setState({
      modalOpen: false,
      insurance: [],
      safetyIncreasers: [],
      isSubleted: Boolean(this.props.insurance.data.isSubleted),
      extraBuildings: [
        ...this.props.insurance.data.extraBuildings,
      ] as ExtraBuilding[],
    })
  }

  public shouldBeDisplayed = (field) => {
    switch (field.toLowerCase()) {
      case 'personsinhousehold':
      case 'insurancetype':
      case 'street':
      case 'city':
      case 'zipcode':
      case 'livingspace':
        return true
      case 'ancillaryarea':
      case 'yearofconstruction':
      case 'numberofbathrooms':
        return this.isModifyingHouseInsurance()
      default:
        return false
    }
  }

  public handleChange = (field) => (e) => {
    const { insurance, safetyIncreasers } = this.state

    switch (field) {
      case 'SMOKE_ALARM':
      case 'FIRE_EXTINGUISHER':
      case 'SAFETY_DOOR':
      case 'GATE':
      case 'BURGLAR_ALARM':
      case 'NONE':
        safetyIncreasers.indexOf(field) === -1
          ? safetyIncreasers.push(field)
          : safetyIncreasers.splice(safetyIncreasers.indexOf(field), 1)
        insurance.safetyIncreasers = safetyIncreasers
        break
      case 'isStudent':
        this.setState((state) => ({ isStudent: !state.isStudent }))
        insurance[field] = this.state.isStudent
        break
      case 'isSubleted':
        this.setState((state) => ({ isSubleted: !state.isSubleted }))
        break
      default:
        insurance[field] = e.target.value
        break
    }
    this.setState({ insurance })
  }

  public handleCancel = () => {
    this.handleClose()
  }

  public handleSubmissionButton = (mutate) => async () => {
    const { insurance } = this.props
    const submittedInsurance = {
      ...insurance.data,
      ...this.state.insurance,
      extraBuildings: this.state.extraBuildings,
      isSubleted: this.state.isSubleted,
    }
    const quoteData = createCreateQuoteFromProductRequest(submittedInsurance)
    await mutate({
      variables: { memberId: insurance.data.memberId, quoteData },
    })
  }

  public isModifyingHouseInsurance = () => {
    const insuranceToBeSubmitted = {
      ...this.props.insurance.data,
      ...this.state.insurance,
    }
    return insuranceToBeSubmitted.insuranceType === 'HOUSE'
  }

  public hasHouseInsurance = () => {
    const { data } = this.props.insurance
    return data.insuranceType === 'HOUSE'
  }

  public render() {
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
          <ActionHeadline>Create modified insurance</ActionHeadline>
          <Mutation
            mutation={CREATE_QUOTE_FROM_PRODUCT_MUTATION}
            refetchQueries={() => [
              {
                query: QUOTES_QUERY,
                variables: { memberId: fields.memberId },
              },
            ]}
          >
            {(createQuoteFromProduct, createQuoteMutation) => (
              <Modal
                trigger={
                  <HedvigStyledButton
                    onClick={() =>
                      this.setState({ confirmCreateQuoteModalOpen: true })
                    }
                  >
                    Create quote
                  </HedvigStyledButton>
                }
                open={this.state.confirmCreateQuoteModalOpen}
                size="tiny"
                onClose={() =>
                  this.setState({ confirmCreateQuoteModalOpen: false })
                }
              >
                <Modal.Content>
                  {createQuoteMutation &&
                  createQuoteMutation.data &&
                  createQuoteMutation.data.createQuoteFromProduct ? (
                    <>
                      <SuccessMessage>Quote created!</SuccessMessage>
                      <Button>Go to quote</Button>
                    </>
                  ) : (
                    <h3>Create quote?</h3>
                  )}
                </Modal.Content>
                {!(
                  createQuoteMutation &&
                  createQuoteMutation.data &&
                  createQuoteMutation.data.createQuoteFromProduct
                ) && (
                  <Modal.Actions>
                    <Button.Group>
                      <Button
                        onClick={() =>
                          this.setState({ confirmCreateQuoteModalOpen: false })
                        }
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={this.handleSubmissionButton(
                          createQuoteFromProduct,
                        )}
                        positive
                        disabled={
                          createQuoteMutation.loading ||
                          (createQuoteMutation.data &&
                            createQuoteMutation.data &&
                            createQuoteMutation.data.createQuoteFromProduct)
                        }
                      >
                        Create quote
                      </Button>
                    </Button.Group>
                  </Modal.Actions>
                )}
              </Modal>
            )}
          </Mutation>
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

  public handleCertificateUploadedEvent = (memberId) => (e) => {
    const formData = new FormData()
    formData.set('file', e.target.files[0])
    this.props.sendCertificate(formData, memberId)
  }

  public handleDateChange = (type, e, { value }) => {
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
  private changeCompanyStatus = (e, { checked }) => {
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
  createModifiedQuote: PropTypes.func.isRequired,
}

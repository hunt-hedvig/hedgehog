import { format } from 'date-fns'
import { usePartnerCampaigns } from 'graphql/use-partner-campaigns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import * as moment from 'moment'
import * as React from 'react'
import styled from 'react-emotion'
import { Dropdown, Form, Input, Table } from 'semantic-ui-react'
import { DateTimePicker } from '../../../../shared/hedvig-ui/date-time-picker'
import { Spacing } from '../../../../shared/hedvig-ui/spacing'
import { MainHeadline } from '../../../../shared/hedvig-ui/typography'
import { AssignVoucherPercentageDiscount } from '../../../api/generated/graphql'
import {
  addPartnerPercentageDiscountCodeOptions,
  useAddPartnerPercentageDiscountCode,
} from '../../../graphql/use-add-partner-percentage-discount-code'
import { usePartnerCampaignOwners } from '../../../graphql/use-get-partner-campaign-owners'

interface CampaignQueryFormState {
  code: string | null
  partnerId: string | null
  activeFrom: Date | null
  activeTo: Date | null
}

// export const CampaignCodeTable: React.FC<{
//   // campaignQueryFormState: CampaignQueryFormState
// }> = () => {
//   // interface CampaignQueryFormState {
//   //   code: string | null
//   //   partnerId: string | null
//   //   validFrom: Date | null
//   //   validUntil: Date | null
//   // }
//   //
//   // const [campaignQueryFormState, setCampaignQueryFormState] = React.useState<
//   //   CampaignQueryFormState
//   // >({
//   //   code: null,
//   //   partnerId: null,
//   //   validFrom: null,
//   //   validUntil: null,
//   // })
//   //
//   //
//   const [partnerCampaigns, { loading }] = usePartnerCampaigns()
//
//   return (
//     <Spacing>
//       {loading && 'loading...'}
//       {!loading && partnerCampaigns.length === 0 && 'No partner campaigns :('}
//       <Table celled>
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell>Valid From</Table.HeaderCell>
//             <Table.HeaderCell>Valid To</Table.HeaderCell>
//             <Table.HeaderCell>Campaign Code</Table.HeaderCell>
//             <Table.HeaderCell>Incentive</Table.HeaderCell>
//             <Table.HeaderCell>Campaign Owner</Table.HeaderCell>
//             <Table.HeaderCell>Campaign Owner Name</Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           <>
//             {partnerCampaigns.map((campaign) => (
//               <Table.Row key={campaign.id}>
//                 <Table.Cell>
//                   {campaign.validFrom ?? '-'}
//                   {/*? format(campaign.validFrom, 'yyyy-MM-dd')*/}
//                   {/*  : '-'}*/}
//                 </Table.Cell>
//                 <Table.Cell>
//                   {campaign.validTo ?? '-'}
//                   {/*{campaign.validTo*/}
//                   {/*  ? format(campaign.validTo, 'yyyy-MM-dd')*/}
//                   {/*  : '-'}*/}
//                 </Table.Cell>
//                 <Table.Cell>{campaign.campaignCode}</Table.Cell>
//                 <Table.Cell>{campaign.incentive?.__typename}</Table.Cell>
//                 <Table.Cell>{campaign.partnerId}</Table.Cell>
//                 <Table.Cell>{campaign.partnerName}</Table.Cell>
//               </Table.Row>
//             ))}
//           </>
//         </Table.Body>
//       </Table>
//     </Spacing>
//   )
// }

export const CampaignCodeInfo: React.FC = () => {
  const [filter, setFilter] = React.useState(false)
  const [shouldCreate, setShouldCreate] = React.useState(false)

  const ButtonWrapper = styled('div')`
    padding: 10px;
  `

  const [campaignQueryFormState, setCampaignQueryFormState] = React.useState<
    CampaignQueryFormState
  >({
    code: null,
    partnerId: null,
    activeFrom: null,
    activeTo: null,
  })

  const [partnerCampaigns, { loading, refetch }] = usePartnerCampaigns(
    campaignQueryFormState,
  )

  React.useEffect(() => {
    refetch()
  }, [campaignQueryFormState.partnerId])

  const [
    partnerCampaignOwners,
    { loading: partnerCampaignOwnersLoading },
  ] = usePartnerCampaignOwners()

  const partnerIdOptions: PartnerIdOptions[] = partnerCampaignOwners.map(
    (partnerCampaignOwner) => ({
      key: partnerCampaignOwner.partnerId,
      value: partnerCampaignOwner.partnerId,
      text: partnerCampaignOwner.partnerId,
    }),
  )

  const [
    activeFromDatePickerEnabled,
    setActiveFromDatePickerEnabled,
  ] = React.useState(false)
  const [
    activeToDatePickerEnabled,
    setActiveToDatePickerEnabled,
  ] = React.useState(false)
  const [isWip, setIsWip] = React.useState(false)

  const getTextInput = (
    variable: keyof FilterFormState,
    inputType = 'text',
  ) => (
    <>
      <Input
        onChange={(e) => {
          if (isWip) {
            setIsWip(true)
          }
          setCampaignQueryFormState({
            ...campaignQueryFormState,
            [variable]: e.currentTarget.value,
          })
        }}
        type={inputType}
      />
    </>
  )

  if (partnerCampaignOwnersLoading) {
    return 'loading...'
  }

  const formatDate = (dateToFormat: any) => {
    const date = moment(dateToFormat).local()
    return date.isValid() ? date.format('DD MMMM YYYY') : '-'
  }

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <ButtonWrapper>
        <ButtonsGroup>
          <Button onClick={() => setFilter(!filter)}>Filter codes</Button>
          <Button onClick={() => setShouldCreate(!shouldCreate)}>
            Create new code
          </Button>
        </ButtonsGroup>
      </ButtonWrapper>
      {filter && (
        <Form>
          <Form.Field>
            <label>Code</label>
            {getTextInput('code', 'Code')}
          </Form.Field>
          <Form.Field>
            <label>Campaign owner id</label>
            <Dropdown
              placeholder="partnerId"
              fluid
              search
              selection
              options={partnerIdOptions}
              onChange={(_, data) => {
                if (isWip) {
                  setIsWip(true)
                }
                setCampaignQueryFormState({
                  ...campaignQueryFormState,
                  partnerId: data.value as string,
                })
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Campaign code active from</label>
            <input
              onClick={() =>
                setActiveFromDatePickerEnabled(!activeFromDatePickerEnabled)
              }
              placeholder={
                campaignQueryFormState.activeFrom
                  ? format(campaignQueryFormState.activeFrom, 'yyyy-MM-dd')
                  : ''
              }
            />
            {activeFromDatePickerEnabled && (
              <>
                <DateTimePicker
                  date={campaignQueryFormState.activeFrom!!}
                  setDate={(data) => {
                    setCampaignQueryFormState({
                      ...campaignQueryFormState,
                      activeFrom: data,
                    })
                  }}
                />
              </>
            )}
          </Form.Field>
          <Form.Field>
            <label>Campaign code active to</label>
            <input
              onClick={() =>
                setActiveToDatePickerEnabled(!activeToDatePickerEnabled)
              }
              placeholder={
                campaignQueryFormState.activeFrom
                  ? format(campaignQueryFormState.activeFrom, 'yyyy-MM-dd')
                  : ''
              }
            />
            {activeToDatePickerEnabled && (
              <>
                <DateTimePicker
                  date={campaignQueryFormState.activeTo!!}
                  setDate={(data) => {
                    setCampaignQueryFormState({
                      ...campaignQueryFormState,
                      activeTo: data,
                    })
                  }}
                />
              </>
            )}
          </Form.Field>
        </Form>
      )}
      {shouldCreate && (
        <CreateNewCampaignCode partnerIdOptions={partnerIdOptions} />
      )}
      <Spacing>
        {loading && 'loading...'}
        {!loading && partnerCampaigns.length === 0 && 'No partner campaigns :('}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Valid From</Table.HeaderCell>
              <Table.HeaderCell>Valid To</Table.HeaderCell>
              <Table.HeaderCell>Campaign Code</Table.HeaderCell>
              <Table.HeaderCell>Incentive</Table.HeaderCell>
              <Table.HeaderCell>Campaign Owner</Table.HeaderCell>
              <Table.HeaderCell>Campaign Owner Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <>
              {partnerCampaigns.map((campaign) => (
                <Table.Row key={campaign.id}>
                  <Table.Cell>
                    {campaign.validFrom ? formatDate(campaign.validFrom) : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {campaign.validTo ? formatDate(campaign.validTo) : '-'}
                  </Table.Cell>
                  <Table.Cell>{campaign.campaignCode}</Table.Cell>
                  <Table.Cell>{campaign.incentive?.__typename}</Table.Cell>
                  <Table.Cell>{campaign.partnerId}</Table.Cell>
                  <Table.Cell>{campaign.partnerName}</Table.Cell>
                </Table.Row>
              ))}
            </>
          </Table.Body>
        </Table>
      </Spacing>
    </>
  )
}

interface FilterFormState {
  code: string | null
  campaignOwnerId: string | null
}

interface PartnerIdOptions {
  key: string
  value: string
  text: string
}

// export const FilterCodes: React.FC<{
//   partnerIdOptions: PartnerIdOptions[]
// }> = ({ partnerIdOptions }) => {
//   const [
//     activeFromDatePickerEnabled,
//     setActiveFromDatePickerEnabled,
//   ] = React.useState(false)
//   const [
//     activeToDatePickerEnabled,
//     setActiveToDatePickerEnabled,
//   ] = React.useState(false)
//   const [isWip, setIsWip] = React.useState(false)
//
//   interface CampaignQueryFormState {
//     code: string | null
//     partnerId: string | null
//     validFrom: Date | null
//     validUntil: Date | null
//   }
//
//   const [campaignQueryFormState, setCampaignQueryFormState] = React.useState<
//     CampaignQueryFormState
//   >({
//     code: null,
//     partnerId: null,
//     validFrom: null,
//     validUntil: null,
//   })
//
//   const [partnerCampaigns, { loading }] = usePartnerCampaigns(
//     campaignQueryFormState,
//   )
//
//   const getTextInput = (
//     variable: keyof FilterFormState,
//     inputType = 'text',
//   ) => (
//     <>
//       <Input
//         onChange={(e) => {
//           if (isWip) {
//             setIsWip(true)
//           }
//           setCampaignQueryFormState({
//             ...campaignQueryFormState,
//             [variable]: e.currentTarget.value,
//           })
//         }}
//         type={inputType}
//       />
//     </>
//   )
//
//   return (
//     <Form>
//       <Form.Field>
//         <label>Code</label>
//         {getTextInput('code', 'Code')}
//       </Form.Field>
//       <Form.Field>
//         <label>Campaign owner id</label>
//         <Dropdown
//           placeholder="partnerId"
//           fluid
//           search
//           selection
//           options={partnerIdOptions}
//           onChange={(_, data) => {
//             if (isWip) {
//               setIsWip(true)
//             }
//             setCampaignQueryFormState({
//               ...campaignQueryFormState,
//               partnerId: data.value as string,
//             })
//           }}
//         />
//       </Form.Field>
//       <Form.Field>
//         <label>Campaign code active from</label>
//         <input
//           onClick={() =>
//             setActiveFromDatePickerEnabled(!activeFromDatePickerEnabled)
//           }
//           placeholder={
//             campaignQueryFormState.validFrom
//               ? format(campaignQueryFormState.validFrom, 'yyyy-MM-dd')
//               : ''
//           }
//         />
//         {activeFromDatePickerEnabled && (
//           <>
//             <DateTimePicker
//               date={campaignQueryFormState.validFrom!!}
//               setDate={(data) => {
//                 setCampaignQueryFormState({
//                   ...campaignQueryFormState,
//                   validFrom: data,
//                 })
//               }}
//             />
//           </>
//         )}
//       </Form.Field>
//       <Form.Field>
//         <label>Campaign code active to</label>
//         <input
//           onClick={() =>
//             setActiveToDatePickerEnabled(!activeToDatePickerEnabled)
//           }
//           placeholder={
//             campaignQueryFormState.validUntil
//               ? format(campaignQueryFormState.validUntil, 'yyyy-MM-dd')
//               : ''
//           }
//         />
//         {activeToDatePickerEnabled && (
//           <>
//             <DateTimePicker
//               date={campaignQueryFormState.validUntil!!}
//               setDate={(data) => {
//                 setCampaignQueryFormState({
//                   ...campaignQueryFormState,
//                   validUntil: data,
//                 })
//               }}
//             />
//           </>
//         )}
//       </Form.Field>
//       {/*<Button*/}
//       {/*  type="submit"*/}
//       {/*  onClick={() => {*/}
//       {/*    partnerCampaigns*/}
//       {/*  }}*/}
//       {/*>*/}
//       {/*  Filter*/}
//       {/*</Button>*/}
//     </Form>
//   )
// }

interface NewCampaignCodeFormState {
  code: string | null
  partnerId: string | null
  numberOfMonths: number | null
  percentageDiscount: number | null
  validFrom: Date | null
  validUntil: Date | null
}

export const CreateNewCampaignCode: React.FC<{
  partnerIdOptions: PartnerIdOptions[]
}> = ({ partnerIdOptions }) => {
  const [
    setPartnerPercentageDiscount,
    { loading: addPartnerPercentageDiscountLoading },
  ] = useAddPartnerPercentageDiscountCode()

  const [isWip, setIsWip] = React.useState(false)

  const [
    activeFromDatePickerEnabled,
    setActiveFromDatePickerEnabled,
  ] = React.useState(false)
  const [
    activeToDatePickerEnabled,
    setActiveToDatePickerEnabled,
  ] = React.useState(false)

  const [newCampaignCodeFormState, setCampaignCodeFormState] = React.useState<
    NewCampaignCodeFormState
  >({
    code: null,
    partnerId: null,
    numberOfMonths: null,
    percentageDiscount: null,
    validFrom: null,
    validUntil: null,
  })

  const getTextInput = (
    variable: keyof NewCampaignCodeFormState,
    inputType = 'text',
  ) => (
    <>
      <Input
        onChange={(e) => {
          if (isWip) {
            setIsWip(true)
          }
          setCampaignCodeFormState({
            ...newCampaignCodeFormState,
            [variable]: e.currentTarget.value,
          })
        }}
        type={inputType}
      />
    </>
  )

  if (addPartnerPercentageDiscountLoading) {
    return 'loading...'
  }

  const generateRange = (min: number, max: number, step: number): number[] => {
    const numberArray: number[] = []
    for (let num = min; num <= max; num += step) {
      numberArray.push(num)
    }
    return numberArray
  }

  const numberOfMonthsOptions = generateRange(1, 12, 1).map((noOfMonths) => ({
    key: noOfMonths,
    value: noOfMonths,
    text: noOfMonths,
  }))

  const percentageDiscountOptions = generateRange(5, 100, 5).map(
    (percentage) => ({
      key: percentage + '%',
      value: percentage,
      text: percentage + '%',
    }),
  )

  const getVoucherPercentageDiscountData = (
    formState: NewCampaignCodeFormState,
  ): AssignVoucherPercentageDiscount => {
    return {
      code: formState.code!!,
      partnerId: formState.partnerId!!,
      numberOfMonths: formState.numberOfMonths!!,
      percentageDiscount: formState.percentageDiscount!!,
      validFrom: formState.validFrom!!,
      validUntil: formState.validUntil!!,
    }
  }

  return (
    <>
      <Form>
        <Form.Field>
          <label>Code</label>
          {getTextInput('code', 'Code')}
        </Form.Field>
        <Form.Field>
          <label>Partner id</label>
          <Dropdown
            placeholder="partnerId"
            fluid
            search
            selection
            options={partnerIdOptions}
            onChange={(_, data) => {
              if (isWip) {
                setIsWip(true)
              }
              setCampaignCodeFormState({
                ...newCampaignCodeFormState,
                partnerId: data.value as string,
              })
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Number of months</label>
          <Dropdown
            placeholder="number of months"
            fluid
            search
            selection
            options={numberOfMonthsOptions}
            onChange={(_, data) => {
              if (isWip) {
                setIsWip(true)
              }
              setCampaignCodeFormState({
                ...newCampaignCodeFormState,
                numberOfMonths: data.value as number,
              })
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Percentage discount</label>
          <Dropdown
            placeholder="Percentage discount %"
            fluid
            search
            selection
            options={percentageDiscountOptions}
            onChange={(_, data) => {
              if (isWip) {
                setIsWip(true)
              }
              setCampaignCodeFormState({
                ...newCampaignCodeFormState,
                percentageDiscount: (data.value as number) * 0.01,
              })
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Valid from</label>
          <input
            onClick={() =>
              setActiveFromDatePickerEnabled(!activeFromDatePickerEnabled)
            }
            placeholder={
              newCampaignCodeFormState.validFrom
                ? format(newCampaignCodeFormState.validFrom, 'yyyy-MM-dd')
                : ''
            }
          />
          {activeFromDatePickerEnabled && (
            <>
              <DateTimePicker
                date={newCampaignCodeFormState.validFrom!!}
                setDate={(data) => {
                  setCampaignCodeFormState({
                    ...newCampaignCodeFormState,
                    validFrom: data,
                  })
                }}
              />
            </>
          )}
        </Form.Field>
        <Form.Field>
          <label>Valid to</label>
          <input
            onClick={() =>
              setActiveToDatePickerEnabled(!activeToDatePickerEnabled)
            }
            placeholder={
              newCampaignCodeFormState.validUntil
                ? format(newCampaignCodeFormState.validUntil, 'yyyy-MM-dd')
                : ''
            }
          />
          {activeToDatePickerEnabled && (
            <>
              <DateTimePicker
                date={newCampaignCodeFormState.validUntil!!}
                setDate={(data) => {
                  setCampaignCodeFormState({
                    ...newCampaignCodeFormState,
                    validUntil: data,
                  })
                }}
              />
            </>
          )}
        </Form.Field>
        <Button
          type="submit"
          onClick={() => {
            setPartnerPercentageDiscount(
              addPartnerPercentageDiscountCodeOptions(
                getVoucherPercentageDiscountData(newCampaignCodeFormState),
              ),
            )
          }}
        >
          Create
        </Button>
      </Form>
    </>
  )
}

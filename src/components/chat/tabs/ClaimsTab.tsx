import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ClaimsList from 'components/claims/claims-list/ClaimsList'
import DateInput from 'components/shared/inputs/DateInput'
import MaterialModal from 'components/shared/modals/MaterialModal'
import { ActionMap, Container } from 'constate'
import gql from 'graphql-tag'
import * as moment from 'moment'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled, { css } from 'react-emotion'
import { history } from 'store'

const buttonStyle = css({
  width: '130px',
  alignSelf: 'flex-end',
})

const InlineFlexButton = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
})

const InlineFlex = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
})

const types = [
  {
    value: 'EMAIL',
    label: 'Email',
  },
  {
    value: 'INTERCOM',
    label: 'Intercom',
  },
  {
    value: 'PHONE',
    label: 'Phone',
  },
  {
    value: 'CHAT',
    label: 'Chat',
  },
]

const CREATE_CLAIM_MUTATION = gql`
  mutation createClaim(
    $memberId: ID!
    $date: LocalDateTime!
    $source: ClaimSource!
  ) {
    createClaim(memberId: $memberId, date: $date, source: $source)
  }
`

interface ClaimsTabProps {
  classes: any
  memberClaims: object[]
  sortClaimsList?: () => void
}

interface State {
  open: boolean
  date?: any
  value: string
}

interface Actions {
  handleClose: () => void
  handleOpen: () => void
  handleClaimSubmit: (mutation: any) => void
  typeChangeHandler: (event: object) => void
  dateChangeHandler?: (type: string, e: any, value: object) => void
}

const ClaimsTab: React.SFC<ClaimsTabProps> = (props) => {
  return (
    <Container<State, ActionMap<State, Actions>>
      initialState={{
        open: false,
        date: moment(),
        value: 'EMAIL',
      }}
      actions={{
        handleClose: () => (state) => ({ open: false }),
        handleOpen: () => (state) => ({ open: true }),
        handleClaimSubmit: (mutation) => (state) => {
          mutation({
            variables: {
              memberId: props.insurance.data.memberId,
              date: state.date,
              source: state.value,
            },
          }).then((response) => {
            history.push(
              `/claims/${response.data.createClaim}/members/${
                props.insurance.data.memberId
              }`,
            )
          })
          return { date: moment(), value: 'EMAIL', open: false }
        },
        typeChangeHandler: (event) => (state) => ({
          value: event.target.value,
        }),
        dateChangeHandler: (type, e, { value }) => ({
          date: moment(value).format('YYYY-MM-DDTHH:mm:ss'),
        }),
      }}
    >
      {({
        handleClose,
        handleOpen,
        dateChangeHandler,
        typeChangeHandler,
        handleClaimSubmit,
        open,
        value,
      }) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            className={buttonStyle}
          >
            Add new claim
          </Button>
          {props.memberClaims.length > 0 ? (
            <ClaimsList
              claims={{ list: props.memberClaims }}
              sortClaimsList={props.sortClaimsList}
            />
          ) : (
            <Typography variant="h5" component="h3">
              Claims list is empty
            </Typography>
          )}
          <MaterialModal handleClose={handleClose} open={open}>
            <Typography variant="h5" id="modal-title">
              Create claim
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              Choose notification date and type of claim.
            </Typography>
            <InlineFlex>
              <TextField
                id="filled-select-currency"
                select
                label="Select"
                value={value}
                onChange={typeChangeHandler}
                helperText="Please select claim type"
                margin="normal"
                variant="filled"
              >
                {types.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <DateInput
                changeHandler={dateChangeHandler}
                forbidFuture={true}
                label="Notification date"
              />
            </InlineFlex>
            <InlineFlexButton>
              <Mutation mutation={CREATE_CLAIM_MUTATION}>
                {(createClaim) => (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleClaimSubmit(createClaim)}
                    className={buttonStyle}
                  >
                    Save
                  </Button>
                )}
              </Mutation>
            </InlineFlexButton>
          </MaterialModal>
        </> 
      )}
    </Container>
  )
}

export default ClaimsTab

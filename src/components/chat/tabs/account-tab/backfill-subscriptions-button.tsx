import { gql } from 'apollo-boost'
import { SubmitButton } from 'components/chat/tabs/account-tab/add-entry-form'
import { GET_MEMBER_ACCOUNT_QUERY } from 'components/chat/tabs/AccountTab'
import * as React from 'react'
import { Mutation } from 'react-apollo'

const BACKFILL_SUBSCRIPTIONS_MUTATION = gql`
  mutation backfillSubscriptions($memberId: ID!) {
    backfillSubscriptions(memberId: $memberId) {
      memberId
    }
  }
`

interface State {
  confirmed: boolean
}

export class BackfillSubscriptionsButton extends React.Component<
  {
    memberId: string
    showNotification: (data: any) => void
  },
  State
> {
  public state = {
    confirmed: false,
  }

  public render() {
    return (
      <Mutation
        mutation={BACKFILL_SUBSCRIPTIONS_MUTATION}
      >
        {(backfillSubscriptions, { loading }) => (
          <>
            {!this.state.confirmed ? (
              <SubmitButton
                type="button"
                variant="contained"
                color="default"
                onClick={(e) => {
                  e.preventDefault()
                  this.toggleConfirmed()
                }}
                disabled={loading}
              >
                Backfill All Subscriptions
              </SubmitButton>
            ) : (
              <SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={() =>
                  backfillSubscriptions({
                    variables: { memberId: this.props.memberId },
                  })
                    .then(() => {
                      this.props.showNotification({
                        message: 'Member subscriptions backfilled.',
                        header: 'Success',
                        type: 'olive',
                      })
                      this.resetConfirmed()
                    })
                    .catch((error) => {
                      this.props.showNotification({
                        message: error.message,
                        header: 'Error',
                        type: 'red',
                      })

                      throw error
                    })
                }
              >
                Are you sure? (Have you talked to Elvin?)
              </SubmitButton>
            )}
          </>
        )}
      </Mutation>
    )
  }

  private resetConfirmed = () => this.setState({ confirmed: false })

  private toggleConfirmed = () =>
    this.setState((state) => ({ confirmed: !state.confirmed }))
}

import styled from '@emotion/styled'
import {
  Button,
  DateTimePicker,
  EnumDropdown,
  FadeIn,
  LoadingMessage,
  MainHeadline,
  Spacing,
  StandaloneMessage,
} from '@hedvig-ui'
import { ClaimSource, useCreateClaimMutation } from 'api/generated/graphql'
import { ClaimListHeader } from 'components/claims/claims-list/components/ClaimListHeader'
import { ClaimListItem } from 'components/claims/claims-list/components/ClaimListItem'
import { format } from 'date-fns'
import { useGetMemberClaims } from 'graphql/use-get-member-claims'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const FormWrapper = styled.div`
  display: inline-flex;
  justify-content: space-between;
  height: 100%;
`

export const ClaimsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [claims, { loading, refetch }] = useGetMemberClaims(memberId)
  const [
    createClaim,
    { loading: createClaimLoading },
  ] = useCreateClaimMutation()

  const [showForm, setShowForm] = React.useState(false)
  const [claimSource, setClaimSource] = React.useState<ClaimSource | null>(null)
  const [claimDate, setClaimDate] = React.useState<Date>(new Date())

  if (loading || !claims) {
    return <LoadingMessage paddingTop="25vh" />
  }

  return (
    <FadeIn>
      <HeaderWrapper>
        <MainHeadline>Claims</MainHeadline>

        <FormWrapper>
          {showForm ? (
            <>
              <EnumDropdown
                enumToSelectFrom={ClaimSource}
                placeholder={'Claim Source'}
                onChange={(source) => setClaimSource(source)}
              />
              <Spacing left={'small'}>
                <DateTimePicker
                  disabled={createClaimLoading}
                  date={claimDate}
                  fullWidth={true}
                  setDate={(date) => setClaimDate(date)}
                  placeholder="Notification date"
                  maxDate={new Date()}
                  showTimePicker
                />
              </Spacing>
              <Spacing left={'small'}>
                <Button
                  disabled={createClaimLoading}
                  variation="danger"
                  color="danger"
                  onClick={() => {
                    setShowForm(false)
                    setClaimDate(new Date())
                    setClaimSource(null)
                  }}
                >
                  Cancel
                </Button>
              </Spacing>
              <Spacing left={'small'}>
                <Button
                  disabled={
                    claimSource === null ||
                    claimDate === null ||
                    createClaimLoading
                  }
                  variation="success"
                  color="success"
                  onClick={async () => {
                    if (claimSource === null || claimDate === null) {
                      return
                    }

                    await toast.promise(
                      createClaim({
                        variables: {
                          memberId,
                          date: format(claimDate, "yyyy-MM-dd'T'HH:mm:ss"),
                          source: claimSource,
                        },
                      }),
                      {
                        loading: 'Creating claim',
                        success: () => {
                          setShowForm(false)
                          setClaimDate(new Date())
                          setClaimSource(null)
                          return 'Claim created'
                        },
                        error: 'Could not create claim',
                      },
                    )

                    await refetch()
                  }}
                >
                  Add
                </Button>
              </Spacing>
            </>
          ) : (
            <Button
              variation="primary"
              color="primary"
              onClick={() => setShowForm(true)}
            >
              Add new claim
            </Button>
          )}
        </FormWrapper>
      </HeaderWrapper>
      {claims.length === 0 ? (
        <StandaloneMessage paddingTop="10vh">
          No claims for member
        </StandaloneMessage>
      ) : (
        <Table celled selectable>
          <ClaimListHeader />
          <Table.Body>
            {claims.map((item, index) => (
              <ClaimListItem key={item.id} item={item} index={index} />
            ))}
          </Table.Body>
        </Table>
      )}
    </FadeIn>
  )
}

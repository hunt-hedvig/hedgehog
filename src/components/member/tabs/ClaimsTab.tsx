import styled from '@emotion/styled'
import {
  ClaimSource,
  GetMemberClaimsDocument,
  useCreateClaimMutation,
} from 'api/generated/graphql'
import { MemberClaimsList } from 'components/organisms/MemberClaimsList'
import { format } from 'date-fns'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { Button } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'

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
  const [
    createClaim,
    { loading: createClaimLoading },
  ] = useCreateClaimMutation()

  const [showForm, setShowForm] = React.useState(false)
  const [claimSource, setClaimSource] = React.useState<ClaimSource | null>(null)
  const [claimDate, setClaimDate] = React.useState<Date>(new Date())

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
                        refetchQueries: [
                          {
                            query: GetMemberClaimsDocument,
                            variables: { memberId },
                          },
                        ],
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
      <MemberClaimsList memberId={memberId} />
    </FadeIn>
  )
}

import styled from '@emotion/styled'
import {
  Button,
  DateTimePicker,
  EnumDropdown,
  FadeIn,
  MainHeadline,
  Spacing,
} from '@hedvig-ui'
import { format } from 'date-fns'
import { MemberClaimsList } from 'features/member/tabs/claims-tab/components/MemberClaimsList'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimSource,
  GetMemberClaimsDocument,
  useCreateClaimMutation,
} from 'types/generated/graphql'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: 130px 170px auto auto;
  column-gap: 14px;
  align-items: center;
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

        {showForm ? (
          <FormWrapper>
            <EnumDropdown
              enumToSelectFrom={ClaimSource}
              placeholder="Claim Source"
              onChange={(source) => setClaimSource(source)}
            />
            <DateTimePicker
              disabled={createClaimLoading}
              date={claimDate}
              fullWidth={true}
              setDate={(date) => setClaimDate(date)}
              placeholder="Notification date"
              maxDate={new Date()}
              showTimePicker
            />
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
            <Button
              disabled={
                claimSource === null || claimDate === null || createClaimLoading
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
          </FormWrapper>
        ) : (
          <Button
            variation="primary"
            color="primary"
            onClick={() => setShowForm(true)}
            style={{ height: 39 }}
          >
            Add new claim
          </Button>
        )}
      </HeaderWrapper>
      <Spacing top />
      <MemberClaimsList memberId={memberId} />
    </FadeIn>
  )
}

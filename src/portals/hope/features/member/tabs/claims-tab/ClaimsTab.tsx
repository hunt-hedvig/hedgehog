import styled from '@emotion/styled'
import {
  Button,
  DateTimePicker,
  Dropdown,
  DropdownOption,
  FadeIn,
  MainHeadline,
  Spacing,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import { format } from 'date-fns'
import { MemberClaimsList } from 'portals/hope/features/member/tabs/claims-tab/components/MemberClaimsList'
import React, { useState } from 'react'
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
  onClickClaim: (claimId: string) => void
}> = ({ memberId, onClickClaim }) => {
  const [createClaim, { loading }] = useCreateClaimMutation()

  const [showForm, setShowForm] = useState(false)
  const [claimSource, setClaimSource] = useState<ClaimSource | null>(null)
  const [claimDate, setClaimDate] = useState(new Date())

  return (
    <FadeIn>
      <HeaderWrapper>
        <MainHeadline>Claims</MainHeadline>

        {showForm ? (
          <FormWrapper>
            <Dropdown placeholder="Source">
              {Object.values(ClaimSource).map((source) => (
                <DropdownOption
                  key={source}
                  selected={claimSource === source || false}
                  onClick={() => setClaimSource(source)}
                >
                  {convertEnumToTitle(source)}
                </DropdownOption>
              ))}
            </Dropdown>
            <DateTimePicker
              disabled={loading}
              date={claimDate}
              fullWidth={true}
              setDate={(date) => setClaimDate(date)}
              placeholder="Notification date"
              maxDate={new Date()}
              showTimePicker
            />
            <Button
              disabled={loading}
              variant="secondary"
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
                claimSource === null ||
                claimDate === null ||
                claimDate > new Date() ||
                loading
              }
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
              Create
            </Button>
          </FormWrapper>
        ) : (
          <div>
            <Button onClick={() => setShowForm(true)}>Create new claim</Button>
          </div>
        )}
      </HeaderWrapper>
      <Spacing top />
      <MemberClaimsList memberId={memberId} onClickClaim={onClickClaim} />
    </FadeIn>
  )
}

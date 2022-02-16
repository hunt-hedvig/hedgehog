import {
  Button,
  Checkbox,
  Flex,
  JsonSchemaForm,
  Spinner,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { InsuranceType } from 'portals/hope/features/config/constants'
import { useSchemaForInsuranceType } from 'portals/hope/features/member/tabs/quote-tab/hooks/use-get-schema-for-insurance-type'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuotesDocument,
  useCreateQuoteForMemberBySchemaMutation,
} from 'types/generated/graphql'
import { Stars } from 'react-bootstrap-icons'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { JSONSchema7 } from 'json-schema'
import { useQuoteFieldSuggestions } from 'portals/hope/features/member/tabs/quote-tab/hooks/use-quote-field-suggestions'

const SuggestWrapper = styled.div<{ active?: boolean }>`
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};

  > button {
    min-width: 10rem;
  }

  .suggest-info {
    margin-top: 0.25rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).alpha(0.8).hex()};
    font-size: 0.75rem;
    text-align: center;
    max-width: 10rem;

    transition: opacity 200ms ease-in-out;
    opacity: 0;
  }

  :hover {
    .suggest-info {
      opacity: 1;
    }
  }
`

export const CreateQuoteForm: React.FC<{
  memberId: string
  insuranceType: InsuranceType
  onSubmitted: () => void
  onCancel: () => void
}> = ({ memberId, insuranceType, onSubmitted, onCancel }) => {
  const { suggestions: suggestedValues } = useQuoteFieldSuggestions(memberId)
  const [suggestions, setSuggestions] = useState<null | Record<
    string,
    JSONSchema7 | boolean
  >>(null)

  const [bypassUwgl, setBypassUwgl] = useState(false)

  const [schema, { loading }] = useSchemaForInsuranceType(insuranceType)
  const [createQuoteForMember] = useCreateQuoteForMemberBySchemaMutation()

  const createQuote = (formData: Record<string, unknown>) => {
    toast.promise(
      createQuoteForMember({
        variables: {
          memberId,
          schemaData: {
            ...formData,
            id: schema.$id,
          },
          bypassUnderwritingGuidelines: bypassUwgl,
        },
        refetchQueries: () => [
          {
            query: GetQuotesDocument,
            variables: { memberId },
          },
        ],
      }),
      {
        loading: 'Saving quote',
        success: () => {
          onSubmitted()
          return 'Quote saved'
        },
        error: 'Could not save quote',
      },
    )
  }

  if (loading) {
    return (
      <Flex justify="center" align="center">
        <Spinner />
      </Flex>
    )
  }

  return (
    <>
      <Flex
        fullWidth
        justify="space-between"
        align="center"
        style={{ marginBottom: '0.5rem' }}
      >
        <ThirdLevelHeadline>Create quote</ThirdLevelHeadline>
        <SuggestWrapper active={Object.keys(suggestedValues).length !== 0}>
          <Button
            variant="secondary"
            onClick={() => setSuggestions(suggestedValues)}
            icon={
              <Stars
                width="1rem"
                height="1rem"
                style={{ marginRight: '0.5rem' }}
              />
            }
          >
            Suggest values
          </Button>
          <div className="suggest-info">Based on signed quotes</div>
        </SuggestWrapper>
      </Flex>
      <JsonSchemaForm
        schema={schema}
        onSubmit={createQuote}
        onCancel={onCancel}
        submitText="Create"
        suggestions={suggestions ?? undefined}
      >
        <Checkbox
          checked={bypassUwgl}
          onChange={({ currentTarget: { checked } }) =>
            setBypassUwgl(Boolean(checked))
          }
          label="Bypass underwriting guidelines"
        />
      </JsonSchemaForm>
    </>
  )
}

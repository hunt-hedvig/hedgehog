import {
  getCreateQuoteForMemberBySchemaOptions,
  useCreateQuoteForMemberBySchema,
} from 'graphql/use-create-quote-for-member-by-schema'
import { useSchemaForContractType } from 'graphql/use-get-schema-for-contract-type'
import { JsonSchemaForm } from 'hedvig-ui/json-schema-form'
import React, { useState } from 'react'
import { Checkbox } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const CreateQuoteFormComponent: React.FC<{
  memberId: string
  contractToCreate: string
  onSubmitted: () => void
} & WithShowNotification> = ({
  memberId,
  contractToCreate,
  onSubmitted,
  showNotification,
}) => {
  const [bypassUwgl, setBypassUwgl] = useState(false)

  const [schema, { loading }] = useSchemaForContractType(
    getContractTypeFromContractToCreate(contractToCreate),
  )

  const [createQuoteForMember] = useCreateQuoteForMemberBySchema()

  const createQuote = (formData) => {
    createQuoteForMember(
      getCreateQuoteForMemberBySchemaOptions(
        memberId,
        schema,
        formData,
        bypassUwgl,
      ),
    )
      .then(() => {
        onSubmitted()
      })
      .catch((error) => {
        showNotification({
          type: 'red',
          header: 'Error',
          message: error.message,
        })
      })
  }

  if (loading) {
    return null
  }

  return (
    <JsonSchemaForm
      schema={schema}
      onSubmit={createQuote}
      submitText={'Create'}
    >
      <Checkbox
        style={{ marginTop: '0.75rem' }}
        checked={bypassUwgl}
        onChange={(_, { checked }) => setBypassUwgl(checked!)}
        label={'Bypass underwriting guidelines'}
      />
    </JsonSchemaForm>
  )
}

const getContractTypeFromContractToCreate = (contractToCreate) => {
  switch (contractToCreate) {
    case 'Swedish Apartment':
      return 'SWEDISH_APARTMENT'
    case 'Swedish House':
      return 'SWEDISH_HOUSE'
    case 'Norwegian Home Content':
      return 'NORWEGIAN_HOME_CONTENT'
    case 'Norwegian Travel':
      return 'NORWEGIAN_TRAVEL'
    default:
      return null
  }
}

export const CreateQuoteForm = withShowNotification(CreateQuoteFormComponent)

import { Grid, IconButton } from '@material-ui/core'
import {
  AjvError,
  ArrayFieldTemplateProps,
  ObjectFieldTemplateProps,
  WidgetProps,
} from '@rjsf/core'
import Form from '@rjsf/semantic-ui'
import { TrashIconWrapper } from 'components/claims/claim-details/components/claim-items/components/styles'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import { FourthLevelHeadline } from 'hedvig-ui/typography'
import { JSONSchema7 } from 'json-schema'
import React, { useState } from 'react'
import { Trash } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { Dropdown, FormField } from 'semantic-ui-react'
import { camelcaseToTitleCase, getEnumTitleCase } from 'utils/text'

const ContentWrapper = styled('div')<{ pushTop: boolean }>`
  margin-top: ${({ pushTop }) => (pushTop ? '2.75rem' : 0)};
  label {
    color: ${(p) => p.theme.foreground} !important;
  }
`
const ObjectFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  properties,
}) => {
  return (
    <>
      <Grid container={true} spacing={8}>
        {properties.map((property, index) => {
          return (
            <Grid item={true} xs={6} key={property.name}>
              <ContentWrapper
                pushTop={
                  property.content.props.schema.type === 'boolean' &&
                  index % 2 === 1
                }
              >
                {property.content}
              </ContentWrapper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

const ItemWrapper = styled('div')`
  margin: 1rem 0 1rem 0;
  &:not(:last-of-type) {
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.borderStrong};
  }
`

const ItemTitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`

const ItemRemoveButton = styled(IconButton)`
  padding: 0.5rem;
`

const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  items,
  onAddClick,
  title,
}) => {
  return (
    <>
      {title && (
        <Spacing bottom={'small'}>
          <FourthLevelHeadline>
            {camelcaseToTitleCase(title)}
          </FourthLevelHeadline>
        </Spacing>
      )}
      {items.map((element, index) => {
        return (
          <ItemWrapper key={element.key}>
            <ItemTitleWrapper>
              <strong>{index + 1}.</strong>
              <ItemRemoveButton onClick={element.onDropIndexClick(index)}>
                <TrashIconWrapper>
                  <Trash />
                </TrashIconWrapper>
              </ItemRemoveButton>
            </ItemTitleWrapper>
            {element.children}
          </ItemWrapper>
        )
      })}
      <Button
        fullWidth
        onClick={(e) => {
          e.preventDefault()
          onAddClick()
        }}
      >
        + Add
      </Button>
    </>
  )
}

const CustomSelectWidget: React.FC<WidgetProps> = ({
  id,
  label,
  value,
  onChange,
  schema,
}) => {
  return (
    <FormField>
      <label htmlFor={id}>{label}</label>
      <Dropdown
        id={id}
        style={{ borderRadius: '0.5rem' }}
        fluid
        selection
        value={value}
        onChange={(_, e) => onChange(e.value)}
        options={schema.enum!.map((enumValue) => {
          return {
            text: getEnumTitleCase(enumValue as string),
            value: enumValue as string,
          }
        })}
      />
    </FormField>
  )
}

const transformErrors = (errors: AjvError[]): AjvError[] => {
  return errors.map((error) => {
    switch (error.name) {
      case 'type':
        if (error.params.type === 'integer') {
          error.message = `Must be a number`
        } else if (error.params.type === 'string') {
          error.message = `Must be a text`
        }
        break
      case 'maxLength':
        error.message = `Should not be longer than ${error.params.limit} characters`
        break
      case 'minLength':
        error.message = `Should not be shorter than ${error.params.limit} characters`
        break
      case 'minimum':
        error.message = `Should be greater than ${!error.params.exclusive &&
          '(or equal to) '}${error.params.limit}`
        break
      case 'maximum':
        error.message = `Should be less than ${!error.params.exlusive &&
          '(or equal to) '}${error.params.limit}`
        break
    }
    error.stack = `${getPropertyTitle(error.property)}: ${error.message}`
    return error
  })
}

const getPropertyTitle = (property) => {
  return camelcaseToTitleCase(property.substring(1))
}

export const JsonSchemaForm: React.FC<{
  schema: JSONSchema7
  onSubmit: (formData: Record<string, unknown>) => void
  initialFormData?: Record<string, unknown>
  submitText?: string
}> = ({ schema, onSubmit, initialFormData, submitText, children }) => {
  const uiSchema = {
    'ui:ObjectFieldTemplate': ObjectFieldTemplate,
  }
  const [formData, setFormData] = useState(initialFormData ?? null)
  return (
    <Form
      style={{ width: '100%' }}
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={(e) => setFormData(e.formData)}
      onSubmit={(e) => {
        setFormData(e.formData)
        onSubmit(formData!)
      }}
      transformErrors={transformErrors}
      ArrayFieldTemplate={ArrayFieldTemplate}
      widgets={{ SelectWidget: CustomSelectWidget }}
    >
      <ButtonsGroup>
        <Button halfWidth variation={'primary'} type="submit">
          {submitText ?? 'Submit'}
        </Button>
        {children}
      </ButtonsGroup>
    </Form>
  )
}

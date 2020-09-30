import { Grid, IconButton } from '@material-ui/core'
import Form from '@rjsf/semantic-ui'
import { TrashIconWrapper } from 'components/claims/claim-details/components/claim-items/components/styles'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import { FourthLevelHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { Trash } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { Dropdown, FormField } from 'semantic-ui-react'
import { getEnumTitleCase } from 'utils/text'

const ContentWrapper = styled('div')<{ shouldAddMargin: boolean }>`
  margin-top: ${({ shouldAddMargin }) => (shouldAddMargin ? '2.75rem' : 0)};
`

const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
}) => {
  return (
    <>
      {(uiSchema['ui:title'] || title) && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={title}
          required={required}
        />
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )}
      <Grid container={true} spacing={8}>
        {properties.map((element, index) => {
          return (
            <Grid
              item={true}
              xs={6}
              key={index}
              id={`${idSchema.$id}-${index}`}
            >
              <ContentWrapper
                shouldAddMargin={
                  element.content.props.schema.type === 'boolean' &&
                  index % 2 === 1
                }
              >
                {element.content}
              </ContentWrapper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

const ItemWrapper = styled('div')`
  margin: 1rem 0 2rem 0;
`

const ItemTitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`

const ItemRemoveButton = styled(IconButton)`
  padding: 0.5rem;
`

const ArrayFieldTemplate = ({ items, onAddClick, title }) => {
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
        element.children.props.schema.title = null
        return (
          <ItemWrapper>
            <ItemTitleWrapper>
              {camelcaseToTitleCase(title)}: {index + 1}
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
          onAddClick(e)
        }}
      >
        + Add
      </Button>
    </>
  )
}

const CustomSelectWidget = (props) => {
  return (
    <FormField>
      <label htmlFor={props.id}>{props.label}</label>
      <Dropdown
        style={{ borderRadius: '0.5rem' }}
        id={props.id}
        fluid
        selection
        value={props.value}
        onChange={(_, e) => props.onChange(e.value)}
        options={props.schema.enum.map((value) => {
          return {
            text: getEnumTitleCase(value),
            value,
          }
        })}
      />
    </FormField>
  )
}

const transformErrors = (errors) => {
  return errors.map((error) => {
    if (error.name === 'type' && error.params.type === 'integer') {
      error.message = `Must be a number`
    } else if (error.name === 'type' && error.params.type === 'string') {
      error.message = `Must be a text`
    } else if (error.name === 'maxLength') {
      error.message = `Should not be longer than ${error.params.limit} characters`
    } else if (error.name === 'minLength') {
      error.message = `Should not be shorter than ${error.params.limit} characters`
    } else if (error.name === 'minimum') {
      error.message = `Should be greater than ${!error.params.exclusive &&
        '(or equal to) '}${error.params.limit}`
    } else if (error.name === 'maximum') {
      error.message = `Should be less than ${!error.params.exlusive &&
        '(or equal to) '}${error.params.limit}`
    } else {
      console.log(error)
    }
    error.stack = `${getPropertyTitle(error.property)}: ${error.message}`
    return error
  })
}

const getPropertyTitle = (property) => {
  return camelcaseToTitleCase(property.substring(1))
}

const camelcaseToTitleCase = (text) =>
  text.charAt(0).toUpperCase() + text.substring(1).replace(/(\B[A-Z])/g, ' $1')

const StyledForm = styled(Form)`
  width: 100%;
`

export const JsonSchemaForm: React.FC<{
  schema: object
  onSubmit: (formData) => void
  initialFormData?: object
  submitText?: string
}> = ({ schema, onSubmit, initialFormData, submitText, children }) => {
  const uiSchema = {
    'ui:ObjectFieldTemplate': ObjectFieldTemplate,
  }
  const [formData, setFormData] = useState(initialFormData ?? null)
  console.log(formData)
  return (
    <StyledForm
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={(e) => setFormData(e.formData)}
      onSubmit={() => onSubmit(formData)}
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
    </StyledForm>
  )
}

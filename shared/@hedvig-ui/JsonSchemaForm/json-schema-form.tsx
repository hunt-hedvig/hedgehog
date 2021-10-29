import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  FourthLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import Form, {
  AjvError,
  ArrayFieldTemplateProps,
  ObjectFieldTemplateProps,
  WidgetProps,
} from '@rjsf/core'
import { JSONSchema7 } from 'json-schema'
import React, { useState } from 'react'
import { Trash } from 'react-bootstrap-icons'
import { convertCamelcaseToTitle, convertEnumToTitle } from '../utils/text'

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
    <div>
      {properties.map((property, index) => {
        return (
          <div>
            <ContentWrapper
              pushTop={
                property.content.props.schema.type === 'boolean' &&
                index % 2 === 1
              }
            >
              {property.content}
            </ContentWrapper>
          </div>
        )
      })}
    </div>
  )
}

const FormWrapper = styled.div`
  & .field-object,
  & fieldset {
    border: none;
  }

  & .field-object > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1em;
  }

  & .field {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;

    input {
      padding: 10px 15px;
      border-radius: 4px;
      border: none;
      border: 1px solid ${({ theme }) => theme.border};
    }
  }

  & .form-group {
    .checkbox {
      & > label {
        display: flex;
        align-items: center;

        input {
          width: 17px;
          height: 17px;
          margin-right: 8px;
        }
      }
    }
  }

  & .panel-title,
  & .text-danger,
  & .required {
    color: ${({ theme }) => theme.danger};
  }
`

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

const TrashIcon = styled(Trash)`
  color: ${({ theme }) => theme.danger};
  width: 15px;
  height: 15px;
`

const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  items,
  onAddClick,
  title,
}) => {
  return (
    <>
      {title && (
        <Spacing bottom="small">
          <FourthLevelHeadline>
            {convertCamelcaseToTitle(title)}
          </FourthLevelHeadline>
        </Spacing>
      )}
      {items.map((element, index) => {
        return (
          <ItemWrapper key={element.key}>
            <ItemTitleWrapper>
              <strong>{index + 1}.</strong>
              <Button
                variant="tertiary"
                onClick={element.onDropIndexClick(index)}
              >
                <TrashIcon />
              </Button>
            </ItemTitleWrapper>
            {element.children}
          </ItemWrapper>
        )
      })}
      <Button
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
  value,
  onChange,
  schema,
}) => {
  const options = schema.enum!.map((enumValue, idx) => ({
    key: idx,
    text: convertEnumToTitle(enumValue as string),
    value: enumValue as string,
  }))

  return (
    <Dropdown>
      {options.map((opt) => (
        <DropdownOption
          selected={value === opt.value}
          key={opt.key}
          onClick={() => onChange(opt.value)}
        >
          {opt.text}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}

const transformErrors = (errors: AjvError[]): AjvError[] => {
  return errors.map((error) => {
    const transformedError = { ...error }
    switch (error.name) {
      case 'type':
        if (error.params.type === 'integer') {
          transformedError.message = `Must be a number`
        } else if (error.params.type === 'string') {
          transformedError.message = `Must be a text`
        }
        break
      case 'maxLength':
        transformedError.message = `Should not be longer than ${transformedError.params.limit} characters`
        break
      case 'minLength':
        transformedError.message = `Should not be shorter than ${transformedError.params.limit} characters`
        break
      case 'minimum':
        transformedError.message = `Should be greater than ${!transformedError
          .params.exclusive && '(or equal to) '}${
          transformedError.params.limit
        }`
        break
      case 'maximum':
        transformedError.message = `Should be less than ${!transformedError
          .params.exlusive && '(or equal to) '}${transformedError.params.limit}`
        break
    }
    transformedError.stack = `${getPropertyTitle(transformedError.property)}: ${
      transformedError.message
    }`
    return transformedError
  })
}

const getPropertyTitle = (property) => {
  return convertCamelcaseToTitle(property.substring(1))
}

const formatInitialFormData = (
  initialFormData: Record<string, unknown>,
  schema: JSONSchema7,
): Record<string, unknown> => {
  const properties = schema.properties!
  const formData = { ...initialFormData }
  Object.entries(properties).forEach(([key, value]) => {
    formData[key] =
      initialFormData[key] ?? (value as JSONSchema7).default ?? undefined
  })
  return formData
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
  const [formData, setFormData] = useState(
    formatInitialFormData(initialFormData ?? {}, schema),
  )

  return (
    <FormWrapper>
      <Form
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
          <Button type="submit">{submitText ?? 'Submit'}</Button>
          {children}
        </ButtonsGroup>
      </Form>
    </FormWrapper>
  )
}

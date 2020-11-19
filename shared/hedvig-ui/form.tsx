import { ErrorMessage } from '@hookform/error-message'
import { Button, ButtonProps } from 'hedvig-ui/button'
import React from 'react'
import styled from 'react-emotion'
import { Controller, useFormContext, ValidationRules } from 'react-hook-form'
import {
  Dropdown,
  DropdownItemProps,
  Form as SemanticForm,
  FormProps,
} from 'semantic-ui-react'

export const Form: React.FC<{ onSubmit: (data) => void } & FormProps> = ({
  onSubmit,
  children,
  ...props
}) => {
  const { handleSubmit } = useFormContext()

  return (
    <SemanticForm
      onSubmit={handleSubmit(onSubmit)}
      {...props}
      style={{ width: '100%' }}
    >
      {children}
    </SemanticForm>
  )
}

const ErrorMessageWrapper = styled('div')`
  color: ${({ theme }) => theme.danger};
  margin: 0;
`

const FormLabel: React.FC<{
  label: string
  name: string
}> = ({ label, name }) => {
  return <label htmlFor={name}>{label}</label>
}

const FormError: React.FC<{
  name: string
}> = ({ name }) => {
  return (
    <ErrorMessage
      name={name}
      render={({ message }) => {
        return <ErrorMessageWrapper>{message}</ErrorMessageWrapper>
      }}
    />
  )
}

interface FormInputProps {
  type?: 'number' | 'text'
}

const FormInputComponent: React.FC<FormInputProps & FormFieldProps> = ({
  name,
  type,
  rules,
  defaultValue,
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      as={<input type={type} />}
    />
  )
}

export const FormInput: React.FC<FormInputProps & FormFieldProps> = ({
  type = 'text',
  ...props
}) => {
  return (
    <FormField {...props}>
      <FormInputComponent type={type} {...props} />
    </FormField>
  )
}

interface FormDropdownProps {
  options: DropdownItemProps[]
}

const FormDropdownComponent: React.FC<FormDropdownProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  options,
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ onChange, value, onBlur }) => {
        return (
          <Dropdown
            options={options}
            fluid
            selection
            value={value}
            onChange={(_, e) => onChange(e.value)}
            onBlur={onBlur}
          />
        )
      }}
    />
  )
}

export const FormDropdown: React.FC<FormDropdownProps & FormFieldProps> = ({
  options,
  ...props
}) => {
  return (
    <FormField {...props}>
      <FormDropdownComponent options={options} {...props} />
    </FormField>
  )
}

interface FormFieldProps {
  label: string
  name: string
  defaultValue: unknown
  rules?: ValidationRules
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  rules,
  children,
}) => {
  const { errors } = useFormContext()
  return (
    <SemanticForm.Field
      required={Boolean(rules?.required)}
      error={errors && Boolean(errors[name])}
    >
      <FormLabel label={label} name={name} />
      {children}
      <FormError name={name} />
    </SemanticForm.Field>
  )
}

interface SubmitButtonProps extends ButtonProps {
  submitText: string
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  submitText = 'Submit',
  ...props
}) => {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  return (
    <Button disabled={isSubmitting} type={'submit'} {...props}>
      {submitText}
    </Button>
  )
}

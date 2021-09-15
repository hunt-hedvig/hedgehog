import styled from '@emotion/styled'
import { Button, ButtonProps, CustomInputProps, Input, Label } from '@hedvig-ui'
import { ErrorMessage } from '@hookform/error-message'
import React, { useEffect, useRef } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import {
  Dropdown,
  DropdownItemProps,
  Form as SemanticForm,
  FormProps,
  Ref,
  TextArea,
} from 'semantic-ui-react'

const StyledForm = styled(SemanticForm)`
  width: 100%;
`

export const Form: React.FC<{
  onSubmit: (data: FieldValues) => void
} & FormProps> = ({ onSubmit, children, ...props }) => {
  const { handleSubmit } = useFormContext()

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} {...props}>
      {children}
    </StyledForm>
  )
}

const ErrorMessageWrapper = styled('div')`
  color: ${({ theme }) => theme.danger};
  margin: 0;
`

const FormLabel: React.FC<{ name: string } & React.HTMLProps<
  HTMLLabelElement
>> = ({ as, name, children, ...props }) => {
  return (
    <Label htmlFor={name} {...props}>
      {children}
    </Label>
  )
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

interface FormFieldProps {
  label?: React.ReactNode
  name: string
  defaultValue: unknown
  rules?: RegisterOptions
}

interface FormFieldWithRefProps extends FormFieldProps {
  isFocus?: boolean
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
      error={errors && Boolean(errors[name.split('.')[0]])}
    >
      {label && <FormLabel name={name}>{label}</FormLabel>}
      {children}
      <FormError name={name} />
    </SemanticForm.Field>
  )
}

export const SubmitButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  return (
    <Button disabled={isSubmitting} type={'submit'} {...props}>
      {children}
    </Button>
  )
}

const FormInputComponent: React.FC<CustomInputProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  affix,
  affixPosition,
  ...props
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      as={
        <Input
          {...props}
          label={affix}
          labelPosition={affixPosition}
          autoComplete="off"
        />
      }
    />
  )
}

export const FormInput: React.FC<CustomInputProps & FormFieldProps> = ({
  ...props
}) => {
  return (
    <FormField {...props}>
      <FormInputComponent {...props} />
    </FormField>
  )
}

const FormTextAreaComponent: React.FC<FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  ...props
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      as={<TextArea {...props} />}
    />
  )
}

const FormTextAreaWithRefComponent: React.FC<FormFieldWithRefProps> = ({
  name,
  rules,
  defaultValue,
  isFocus,
  ...props
}) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      isFocus ? ref.current.focus() : ref.current.blur()
    }
  }, [isFocus])

  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      as={
        <Ref innerRef={ref}>
          <TextArea {...props} />
        </Ref>
      }
    />
  )
}

export const FormTextArea: React.FC<FormFieldProps> = ({ ...props }) => {
  return (
    <FormField {...props}>
      <FormTextAreaComponent {...props} />
    </FormField>
  )
}

export const FormTextAreaWithRef: React.FC<FormFieldWithRefProps> = ({
  ...props
}) => {
  return (
    <FormField {...props}>
      <FormTextAreaWithRefComponent {...props} />
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

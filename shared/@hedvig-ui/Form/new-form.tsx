import styled from '@emotion/styled'
import { Button, ButtonProps, Input, InputProps, Label } from '@hedvig-ui'
import { ErrorMessage } from '@hookform/error-message'
import React, { HTMLAttributes } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`

const FieldStyled = styled.div`
  position: relative;
`

interface FormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: FieldValues) => void
}

interface FormFieldProps {
  label?: React.ReactNode
  name: string
  defaultValue: unknown
  rules?: RegisterOptions
}

interface FieldProps {
  required?: boolean
  error?: boolean
}

const ErrorMessageWrapper = styled('div')`
  color: ${({ theme }) => theme.danger};
  margin: 0;
  position: absolute;
  bottom: -20px;
  font-size: 12px;
`

export const Form: React.FC<FormProps> = ({ onSubmit, children, ...props }) => {
  const { handleSubmit } = useFormContext()

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} {...props}>
      {children}
    </StyledForm>
  )
}

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

const FieldComponent: React.FC<FieldProps> = ({ children }) => {
  return <FieldStyled>{children}</FieldStyled>
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  rules,
  children,
}) => {
  return (
    <FieldComponent required={Boolean(rules?.required)}>
      {label && <FormLabel name={name}>{label}</FormLabel>}
      {children}
      <FormError name={name} />
    </FieldComponent>
  )
}

export const FormInputComponent: React.FC<InputProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  ...props
}) => {
  const { errors } = useFormContext()
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      as={
        <Input
          error={errors ? Boolean(errors[name.split('.')[0]]) : undefined}
          {...props}
        />
      }
    />
  )
}

export const FormInput: React.FC<InputProps & FormFieldProps> = ({
  ...props
}) => {
  return (
    <FormField {...props}>
      <FormInputComponent {...props} />
    </FormField>
  )
}

export const SubmitButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  return (
    <Button disabled={isSubmitting} type="submit" {...props}>
      {children}
    </Button>
  )
}

// const FormTextAreaComponent: React.FC<TextAreaProps & FormFieldProps> = ({
//   name,
//   rules,
//   defaultValue,
//   ...props
// }) => {
//   return (
//     <Controller
//       name={name}
//       rules={rules}
//       defaultValue={defaultValue}
//       as={<TextArea {...props} />}
//     />
//   )
// }

// export const FormTextArea: React.FC<FormFieldProps> = ({ ...props }) => {
//   return (
//     <FormField {...props}>
//       <FormTextAreaComponent {...props} />
//     </FormField>
//   )
// }

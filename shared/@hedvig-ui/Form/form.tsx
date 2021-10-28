import styled from '@emotion/styled'
import {
  Button,
  ButtonProps,
  Dropdown,
  DropdownOption,
  Input,
  InputProps,
  Label,
  TextArea,
  TextAreaProps,
} from '@hedvig-ui'
import { ErrorMessage } from '@hookform/error-message'
import React, { HTMLAttributes } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'

const StyledForm = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;

  & .form__field {
    margin-bottom: 25px;
  }

  & .form__textarea {
    & .form__error {
      bottom: -15px;
    }
  }
`

const FieldStyled = styled.div`
  position: relative;
`

const ErrorMessageWrapper = styled('div')`
  color: ${({ theme }) => theme.danger};
  margin: 0;
  position: absolute;
  bottom: -20px;
  font-size: 12px;
`

interface FormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: FieldValues) => void
}

interface FormFieldProps {
  label?: React.ReactNode
  name: string
  defaultValue: unknown
  rules?: RegisterOptions
  className?: string
}

interface FieldProps {
  required?: boolean
  error?: boolean
  className?: string
}

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
        return (
          <ErrorMessageWrapper className="form__error">
            {message}
          </ErrorMessageWrapper>
        )
      }}
    />
  )
}

const FieldComponent: React.FC<FieldProps> = ({ className, children }) => {
  return (
    <FieldStyled className={`form__field ${className ?? ''}`}>
      {children}
    </FieldStyled>
  )
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  rules,
  children,
  className,
}) => {
  return (
    <FieldComponent className={className} required={Boolean(rules?.required)}>
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

const FormTextAreaComponent: React.FC<TextAreaProps & FormFieldProps> = ({
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

export const FormTextArea: React.FC<TextAreaProps & FormFieldProps> = ({
  ...props
}) => {
  return (
    <FormField className="form__textarea" {...props}>
      <FormTextAreaComponent {...props} />
    </FormField>
  )
}

interface FormDropdownProps {
  options: Array<{ key: number; value: string | number; text: string | number }>
  placeholder?: string
}

const FormDropdownComponent: React.FC<FormDropdownProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  options,
  placeholder,
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ onChange, value, onBlur }) => (
        <Dropdown onBlur={onBlur} placeholder={placeholder}>
          {options.map((opt) => (
            <DropdownOption
              style={{ fontSize: 14 }}
              key={opt.key}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
            >
              {opt.text}
            </DropdownOption>
          ))}
        </Dropdown>
      )}
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

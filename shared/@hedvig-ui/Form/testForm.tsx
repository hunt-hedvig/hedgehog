import React from 'react'
import styled from '@emotion/styled'
import {
  useFormContext,
  SubmitHandler,
  UseFormProps,
  UseFormRegister,
  FieldValues,
  Ref,
  MultipleFieldErrors,
  Message,
  DeepMap,
} from 'react-hook-form'
import { Input, InputProps, Label } from '@hedvig-ui'
import { ErrorMessage } from '@hookform/error-message'

const StyledForm = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 25px;
`

const ErrorMessageWrapper = styled('div')`
  color: ${({ theme }) => theme.danger};
  margin: 0;
  position: absolute;
  bottom: -20px;
  font-size: 12px;
`

export type FieldError = {
  type: string
  ref?: Ref
  types?: MultipleFieldErrors
  message?: Message
}

export type FieldErrors<TFieldValues extends FieldValues = FieldValues> =
  DeepMap<TFieldValues, FieldError>

interface FormProps<T> {
  defaultValues?: UseFormProps<T>
  onSubmit: SubmitHandler<T>
}

export function Form<T>({
  children,
  onSubmit,
}: FormProps<T> & {
  children: React.ReactElement | Array<React.ReactElement | null> | null
}) {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useFormContext<T>()

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) =>
        child?.props.name
          ? React.createElement(child?.type, {
              ...{
                ...child?.props,
                register,
                errors,
                key: child?.props.name,
              },
            })
          : child,
      )}
    </StyledForm>
  )
}

interface FormLabelProps extends Omit<React.HTMLProps<HTMLLabelElement>, 'as'> {
  name: string
}

const FormLabel: React.FC<FormLabelProps> = ({ name, children, ...props }) => (
  <Label htmlFor={name} {...props}>
    {children}
  </Label>
)

interface FormFieldProps {
  label?: React.ReactNode
  name: string
  errors?: FieldErrors
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  children,
  errors,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      {label && <FormLabel name={name}>{label}</FormLabel>}
      {children}
      <ErrorMessageWrapper>
        <ErrorMessage errors={errors} name={name} />
      </ErrorMessageWrapper>
    </div>
  )
}

interface FormInputProps {
  name: string
  label?: string
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors
}

export const FormInput: React.FC<FormInputProps & InputProps> = ({
  register,
  name,
  errors,
  label,
  ...props
}) => (
  <FormField name={name} errors={errors} label={label}>
    <Input {...register?.(name)} {...props} />
  </FormField>
)

interface FormSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  register?: UseFormRegister<FieldValues>
  name: string
  options: Array<{
    value: string
    text: string
  }>
}

const Select = styled.select`
  appearance: none;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  outline: none;

  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.25em;
  padding: 10px 15px;
  font-size: 14px;
  line-height: 1.1;
  background-color: #fff;

  &::-ms-expand {
    display: none;
  }
`

export const FormSelect: React.FC<FormSelectProps> = ({
  register,
  options,
  name,
  ...props
}) => (
  <Select {...register?.(name)} {...props}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.text}
      </option>
    ))}
  </Select>
)

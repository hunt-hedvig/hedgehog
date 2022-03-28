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
// import { ErrorMessage } from '@hookform/error-message'
import React, { HTMLAttributes } from 'react'
import {
  Control,
  Controller,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'
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

// const ErrorMessageWrapper = styled('div')`
//   color: ${({ theme }) => theme.danger};
//   margin: 0;
//   position: absolute;
//   bottom: -20px;
//   font-size: 12px;
// `

interface FormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: FieldValues) => void
}

interface FormFieldProps {
  label?: React.ReactNode
  name: string
  defaultValue: unknown
  rules?: RegisterOptions
  control?: Control
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

const FormLabel: React.FC<
  { name: string } & Omit<React.HTMLProps<HTMLLabelElement>, 'as'>
> = ({ name, children, ...props }) => (
  <Label htmlFor={name} {...props}>
    {children}
  </Label>
)

// const FormError: React.FC<{
//   name: string
// }> = ({ name }) => (
//   <ErrorMessage
//     name={name}
//     render={({ message }) => {
//       return (
//         <ErrorMessageWrapper className="form__error">
//           {message}
//         </ErrorMessageWrapper>
//       )
//     }}
//   />
// )

const FieldComponent: React.FC<FieldProps> = ({ className, children }) => (
  <FieldStyled className={`form__field ${className ?? ''}`}>
    {children}
  </FieldStyled>
)

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  rules,
  children,
  className,
}) => (
  <FieldComponent className={className} required={Boolean(rules?.required)}>
    {label && <FormLabel name={name}>{label}</FormLabel>}
    {children}
    {/* This one is throw an Exception
    <FormError name={name} /> */}
  </FieldComponent>
)

export const FormInputComponent: React.FC<InputProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  control,
  ...props
}) => (
  <Controller
    render={({
      field: { onChange, onBlur, value, name, ref },
      formState: { errors },
    }) => (
      <Input
        onBlur={onBlur}
        onChange={onChange}
        checked={value}
        name={name}
        error={errors?.amount?.type === 'required'}
        ref={ref}
        {...props}
      />
    )}
    control={control}
    name={name}
    rules={rules}
    defaultValue={defaultValue}
  />
)

export const FormInput: React.FC<InputProps & FormFieldProps> = ({
  ...props
}) => (
  <FormField {...props}>
    <FormInputComponent {...props} />
  </FormField>
)

const FormTextAreaComponent: React.FC<TextAreaProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  control,
  ...props
}) => (
  <Controller
    render={({ field: { onChange, onBlur, value, name, ref } }) => (
      <TextArea
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        ref={ref}
        {...props}
      />
    )}
    control={control}
    name={name}
    rules={rules}
    defaultValue={defaultValue}
  />
)

export const FormTextArea: React.FC<TextAreaProps & FormFieldProps> = ({
  ...props
}) => (
  <FormField className="form__textarea" {...props}>
    <FormTextAreaComponent {...props} />
  </FormField>
)

interface FormDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { key: number; value: string | number; text: string | number }[]
  placeholder?: string
}

const FormDropdownComponent: React.FC<FormDropdownProps & FormFieldProps> = ({
  name,
  rules,
  defaultValue,
  options,
  placeholder,
  control,
  ...props
}) => (
  <Controller
    render={({ field: { onChange, onBlur, value, ref } }) => (
      <Dropdown onBlur={onBlur} placeholder={placeholder} ref={ref} {...props}>
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
    control={control}
    name={name}
    rules={rules}
    defaultValue={defaultValue}
  />
)

export const FormDropdown: React.FC<FormDropdownProps & FormFieldProps> = ({
  options,
  ...props
}) => (
  <FormField {...props}>
    <FormDropdownComponent options={options} {...props} />
  </FormField>
)

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

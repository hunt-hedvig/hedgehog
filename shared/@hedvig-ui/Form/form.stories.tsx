import {
  Form,
  FormDropdown,
  FormInput,
  FormTextArea,
  SubmitButton,
} from '@hedvig-ui'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export default {
  title: 'Form',
  component: Form,
}

const formOptions = [
  {
    key: 1,
    value: 1,
    text: 'First option',
  },
  {
    key: 2,
    value: 2,
    text: 'Second option',
  },
  {
    key: 3,
    value: 3,
    text: 'Third option',
  },
]

export const StandardForm = () => {
  const form = useForm()

  const submitHandler = (e) => {
    console.log(e)
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={submitHandler}>
        <FormInput
          label="Text input"
          name="textInput"
          defaultValue=""
          rules={{
            required: 'This text is reqired',
            minLength: {
              value: 6,
              message: 'This text has to be at least 6 characters long',
            },
            maxLength: {
              value: 6,
              message: 'This text can be no longer than 6 characters long',
            },
            pattern: {
              value: /^Hedvig$/,
              message: 'This text has to be "Hedvig" for some reason',
            },
          }}
        />
        <FormInput
          label="Number input"
          name="numberInput"
          defaultValue=""
          type="number"
          rules={{
            required: 'This number is required',
            min: {
              value: 1000,
              message: 'This number has to be at least 1000',
            },
            max: {
              value: 5000,
              message: 'This number has to be no larger than 5000',
            },
            pattern: {
              value: /^1337$/,
              message: 'Only 1337 is a valid number',
            },
          }}
        />
        <FormInput
          label="Amount input with suffix"
          affix={{
            content: 'SEK',
          }}
          name="amountInput"
          defaultValue=""
          type="number"
        />
        <FormDropdown
          options={formOptions}
          label="Dropdown"
          name="dropdown"
          defaultValue={1}
          rules={{
            min: {
              value: 2,
              message: 'You have to select at least 2',
            },
            max: {
              value: 2,
              message: 'Actually only 2 or less is allowed',
            },
          }}
        />
        <FormTextArea
          label="Amount TextArea with suffix"
          name="amountTextArea"
          defaultValue=""
          rules={{
            required: 'This text is reqired',
            minLength: {
              value: 6,
              message: 'This text has to be at least 6 characters long',
            },
            maxLength: {
              value: 6,
              message: 'This text can be no longer than 6 characters long',
            },
            pattern: {
              value: /^Hedvig$/,
              message: 'This text has to be "Hedvig" for some reason',
            },
          }}
        />
        <SubmitButton>Submit form</SubmitButton>
      </Form>
    </FormProvider>
  )
}

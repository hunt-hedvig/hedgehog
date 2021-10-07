import styled from '@emotion/styled'
import { Button, Flex, Spacing } from '@hedvig-ui'
import { useClickOutside } from '@hedvig-ui/utils/click-outside'
import chroma from 'chroma-js'
import { EditableField } from 'features/claims/claim-details/components/CoInsured/EditableField'
import React, { useRef, useState } from 'react'
import { EnvelopeFill, PersonFill, PhoneFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'

const CoInsuredCard = styled.div`
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentContrast};
  padding: 0.8em;
  border-radius: 8px;
  transition: all 200ms;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent)
        .brighten(0.4)
        .hex()};
  }
`

export const CoInsured: React.FC<{}> = ({}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Rasmus Guterstam')
  const [personalNumber, setPersonalNumber] = useState('19970210-1234')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useClickOutside(cardRef, () => setEditing(false))

  const reset = () => {
    setName('Rasmus Guterstam')
    setPersonalNumber('19970210-1234')
    setEditing(false)
  }

  return (
    <CoInsuredCard ref={cardRef} onClick={() => setEditing(true)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!name) {
            toast.error("Name can't be empty")
            reset()
            return
          }

          if (!personalNumber) {
            toast.error("Personal number can't be empty")
            reset()
            return
          }

          setEditing(false)
          toast.success('Changes applied')
        }}
      >
        <EditableField
          primary={true}
          editing={editing}
          placeholder="Full name of co-insured"
          value={name}
          onChange={(newValue) => {
            setName(newValue)
          }}
        />
        <div style={{ marginTop: '0.5em' }} />
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <PersonFill />
            </div>
          }
          editing={editing}
          placeholder="Personal number"
          value={personalNumber}
          onChange={(newValue) => {
            setPersonalNumber(newValue)
          }}
        />
        {(email || editing) && <div style={{ marginTop: '0.3em' }} />}
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <EnvelopeFill />
            </div>
          }
          editing={editing}
          placeholder="E-mail (optional)"
          value={email}
          onChange={(newValue) => {
            setEmail(newValue)
          }}
        />
        {(phoneNumber || editing) && <div style={{ marginTop: '0.3em' }} />}
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <PhoneFill />
            </div>
          }
          editing={editing}
          placeholder="Phone number (optional)"
          value={phoneNumber}
          onChange={(newValue) => {
            setPhoneNumber(newValue)
          }}
        />

        {editing && (
          <>
            <Spacing top="small" />
            <Flex direction="row">
              <Button variant="secondary" type="submit">
                Save
              </Button>
              <Button
                variant="primary"
                style={{ marginLeft: '1em' }}
                onClick={(e) => {
                  e.stopPropagation()
                  reset()
                }}
              >
                Cancel
              </Button>
            </Flex>
          </>
        )}
      </form>
    </CoInsuredCard>
  )
}

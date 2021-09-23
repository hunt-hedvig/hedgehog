import {
  Button,
  Dropdown,
  Flex,
  Label,
  SearchableDropdown,
  Spacing,
} from '@hedvig-ui'
import React from 'react'

export const CreateRelationForm: React.FC<{}> = () => {
  return (
    <Flex direction="column" fullWidth>
      <Label>Claim Type</Label>
      <Dropdown value={''} onChange={() => void 0} options={[]} />
      <Spacing top={'small'} />
      <Label>Property</Label>
      <div style={{ width: '100%' }}>
        <SearchableDropdown
          creatable={true}
          value={{ label: 'Lol', value: 'Lol' }}
          placeholder="Which incentive type?"
          isClearable={true}
          onChange={() => void 0}
          noOptionsMessage={() => 'No incentive type found'}
          options={[]}
        />
      </div>
      <Spacing top={'small'} />
      <Label>Option</Label>
      <div style={{ width: '100%' }}>
        <SearchableDropdown
          creatable={true}
          value={{ label: 'Lol', value: 'Lol' }}
          placeholder="Which incentive type?"
          isClearable={true}
          onChange={() => void 0}
          noOptionsMessage={() => 'No incentive type found'}
          options={[]}
        />
      </div>
      <Spacing top={'small'} />
      <Button variation="primary">Create</Button>
    </Flex>
  )
}

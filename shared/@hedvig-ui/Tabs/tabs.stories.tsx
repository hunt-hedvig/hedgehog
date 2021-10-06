import { Tab, Tabs } from '@hedvig-ui'
import { boolean } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'Tabs',
  component: Tabs,
}

export const StandartTab = () => (
  <div style={{ margin: '30px', width: 200 }}>
    <Tab
      active={boolean('Is tab active', false)}
      title="tab"
      action={() => {
        alert('Tab pressed')
      }}
    />
  </div>
)

const TABS_LIST = [
  {
    title: 'Tab 1',
    action: () => {
      alert('Tab 1 pressed')
    },
    active: true,
  },
  {
    title: 'Tab 2',
    action: () => {
      alert('Tab 2 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 3',
    action: () => {
      alert('Tab 3 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 4',
    action: () => {
      alert('Tab 4 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 5',
    action: () => {
      alert('Tab 5 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 6',
    action: () => {
      alert('Tab 6 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 7',
    action: () => {
      alert('Tab 7 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 8',
    action: () => {
      alert('Tab 8 pressed')
    },
    active: false,
  },
  {
    title: 'Tab 9',
    action: () => {
      alert('Tab 9 pressed')
    },
    active: false,
  },
]

export const StandartTabs = () => (
  <div style={{ margin: '30px' }}>
    <Tabs list={TABS_LIST} />
  </div>
)

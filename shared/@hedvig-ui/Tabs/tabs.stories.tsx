import { Tab, Tabs } from '@hedvig-ui'
import { boolean } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'Tabs',
  component: Tabs,
}

export const StandartTab = () => (
  <div style={{ margin: '30px', width: 200 }}>
    <Tab active={boolean('Is tab active', false)} title="tab" />
  </div>
)

const TABS_LIST = [
  {
    title: 'Tab 1',
    active: true,
  },
  {
    title: 'Tab 2',
    active: false,
  },
  {
    title: 'Tab 3',
    active: false,
  },
  {
    title: 'Tab 4',
    active: false,
  },
  {
    title: 'Tab 5',
    active: false,
  },
  {
    title: 'Tab 6',
    active: false,
  },
  {
    title: 'Tab 7',
    active: false,
  },
  {
    title: 'Tab 8',
    active: false,
  },
  {
    title: 'Tab 9',
    active: false,
  },
]

export const StandartTabs = () => (
  <div style={{ margin: '30px' }}>
    <Tabs list={TABS_LIST} />
  </div>
)

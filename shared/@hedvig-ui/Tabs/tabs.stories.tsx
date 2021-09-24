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
    collapsedTitle: '1',
  },
  {
    title: 'Tab 2',
    active: false,
    collapsedTitle: '2',
  },
  {
    title: 'Tab 3',
    active: false,
    collapsedTitle: '3',
  },
  {
    title: 'Tab 4',
    active: false,
    collapsedTitle: '4',
  },
  {
    title: 'Tab 5',
    active: false,
    collapsedTitle: '5',
  },
  {
    title: 'Tab 6',
    active: false,
    collapsedTitle: '6',
  },
  {
    title: 'Tab 7',
    active: false,
    collapsedTitle: '7',
  },
  {
    title: 'Tab 8',
    active: false,
    collapsedTitle: '8',
  },
  {
    title: 'Tab 9',
    active: false,
    collapsedTitle: '9',
  },
]

export const StandartTabs = () => (
  <div style={{ margin: '30px' }}>
    <Tabs
      list={TABS_LIST}
      withCollapse={boolean('With collapsed tabs', false)}
    />
  </div>
)

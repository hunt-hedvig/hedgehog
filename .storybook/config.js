import { withTheme } from '../shared/hedvig-ui/storybook-utils'
import { addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

addDecorator(withTheme)
addDecorator(withKnobs)

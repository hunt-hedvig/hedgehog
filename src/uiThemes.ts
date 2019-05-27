import { createMuiTheme } from '@material-ui/core/styles'

const PRIMARY_PURPLE = '#651EFF'
const PRIMARY_PURPLE_DARK = '#0F007A'

const SECONDARY_TURQUOISE = '#1BE9B6'
const SECONDARY_TURQUOISE_DARK = '#009175'

const COMMON_WHITE = '#fff'
const COMMON_BLACK = '#000'

const CUSTOM_WHITE_OFF = '#F9FAFC'
const CUSTOM_BLACK_OFF = '#141033'
const CUSTOM_GREY_LIGHT = '#E9ECEF'
const CUSTOM_GREY_DARK = '#414150'

export const lightUiTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: PRIMARY_PURPLE,
      dark: PRIMARY_PURPLE_DARK,
    },
    secondary: {
      main: SECONDARY_TURQUOISE,
      dark: SECONDARY_TURQUOISE_DARK,
    },
    common: {
      black: COMMON_BLACK,
      white: COMMON_WHITE,
    },
    text: {
      primary: CUSTOM_BLACK_OFF,
      secondary: CUSTOM_GREY_DARK,
    },
    background: {
      paper: CUSTOM_WHITE_OFF,
      default: CUSTOM_GREY_LIGHT,
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Helvetica',
      'sans-serif',
    ].join(','),
  },
  overrides: {
    MuiInput: {
      root: {
        width: '100%',
      },
      input: {
        padding: '1rem 0',
      },
    },
  },
})

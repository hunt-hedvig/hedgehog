import { colorsV3, fonts } from '@hedviginsurance/brand'
import { createMuiTheme } from '@material-ui/core/styles'
import styled, { css } from 'react-emotion'

export const lightUiTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: colorsV3.purple500,
      dark: colorsV3.purple700,
    },
    secondary: {
      main: colorsV3.gray900,
      dark: colorsV3.black,
    },
    common: {
      black: colorsV3.gray900,
      white: colorsV3.gray100,
    },
    text: {
      primary: colorsV3.gray900,
      secondary: colorsV3.gray900,
    },
    background: {
      paper: colorsV3.white,
      default: colorsV3.gray100,
    },
  },
  typography: {
    fontFamily: [fonts.FAVORIT, 'sans-serif'].join(','),
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

export const darkUiTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colorsV3.purple500,
      dark: colorsV3.purple700,
    },
    secondary: {
      main: colorsV3.gray900,
      dark: colorsV3.black,
    },
    common: {
      black: colorsV3.gray900,
      white: colorsV3.gray100,
    },
    text: {
      primary: colorsV3.white,
      secondary: colorsV3.white,
    },
    background: {
      paper: colorsV3.gray700,
      default: colorsV3.gray900,
    },
  },
  typography: {
    fontFamily: [fonts.FAVORIT, 'sans-serif'].join(','),
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

export const lightTheme = {
  type: 'light',
  background: colorsV3.white,
  backgroundLight: colorsV3.gray100,
  highlightBackground: colorsV3.gray200,
  foreground: colorsV3.gray900,
  placeholderColor: colorsV3.gray500,
  border: colorsV3.gray300,
  borderStrong: colorsV3.gray500,
  backgroundTransparent: 'rgba(0, 0, 0, .1)',
  highlight: colorsV3.purple500,
  highlightLight: colorsV3.purple300,
  highlightContrast: colorsV3.white,
}

export const darkTheme: typeof lightTheme = {
  type: 'dark',
  background: colorsV3.gray900,
  backgroundLight: colorsV3.gray800,
  highlightBackground: colorsV3.gray700,
  foreground: colorsV3.white,
  placeholderColor: colorsV3.gray500,
  border: colorsV3.gray800,
  borderStrong: colorsV3.gray500,
  backgroundTransparent: 'rgba(255, 255, 255, .1)',
  highlight: colorsV3.purple500,
  highlightLight: colorsV3.purple300,
  highlightContrast: colorsV3.white,
}

export const SemanticOverrides = styled.div`
  ${({ theme }) => css`
    .ui.breadcrumb a,
    a {
      color: ${theme.highlight};
      &:hover,
      &:focus {
        color: ${theme.highlightLight};
      }
    }

    .ui.breadcrumb {
      .divider {
        color: ${theme.foreground};
      }
      .active.section {
        font-weight: normal;
      }
    }

    .ui.label {
      background: ${theme.highlightBackground};
      color: ${theme.foreground};
    }

    .ui.input {
      input {
        background: ${theme.background};
        color: ${theme.foreground};
        border-color: ${theme.borderStrong};
        &::placeholder {
          color: ${theme.placeholderColor};
        }
      }
    }

    .ui.checkbox {
      input + label:before,
      input:focus + label:before,
      input:checked + label:before {
        background: ${theme.background};
        border-color: ${theme.borderStrong};
      }

      label,
      input:focus + label,
      input:checked + label {
        color: ${theme.foreground};
      }

      input:checked + label:after {
        color: ${theme.foreground};
      }
    }

    .ui.form {
      textarea,
      input {
        border-color: ${theme.borderStrong};
        background: ${theme.backgroundLight};
        color: ${theme.foreground};
      }
    }

    .ui.button {
      font-weight: normal;
      background: ${theme.foreground};
      color: ${theme.background};
      &:hover,
      &:focus {
        background: ${theme.foreground};
        color: ${theme.background};
      }

      &.primary {
        background: ${theme.highlight};
        color: ${theme.highlightContrast};

        &:hover,
        &:focus {
          background: ${theme.highlightLight};
          color: ${theme.highlightContrast};
        }
      }
    }

    .ui.table {
      thead th {
        border-color: ${theme.borderStrong};
        background: ${theme.highlightBackground};
        color: ${theme.foreground};
      }

      tbody td {
        color: ${theme.foreground};
        border: ${theme.borderStrong};
        background: ${theme.backgroundLight};
      }
    }

    .ui.segment {
      background: ${theme.background};
    }

    .ui.tabular.menu {
      .item {
        background: ${theme.backgroundLight};
        color: ${theme.foreground};
      }
      .item.active {
        background: ${theme.background};
        color: ${theme.foreground};
      }
    }

    .ui.header {
      color: ${theme.foreground};
    }
  `};
`

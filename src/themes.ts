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
  background: colorsV3.gray100,
  backgroundLight: colorsV3.white,
  highlightBackground: colorsV3.gray300,
  foreground: colorsV3.gray900,
  semiStrongForeground: colorsV3.gray700,
  placeholderColor: colorsV3.gray500,
  border: colorsV3.gray300,
  borderStrong: colorsV3.gray500,
  backgroundTransparent: 'rgba(0, 0, 0, .1)',
  highlight: colorsV3.purple500,
  highlightLight: colorsV3.purple300,
  highlightDark: colorsV3.purple700,
  highlightContrast: colorsV3.gray900,
  mutedText: colorsV3.gray500,
  mutedBackground: colorsV3.gray300,
  defaultButtonBackground: colorsV3.gray300,
  highlightedButtonBackground: colorsV3.gray500,
  activeInsuranceBackground: '#8dd7cd',
  activeInsuranceForeground: 'rgba(18, 18, 18, 0.73)',
  pendingInsuranceBackground: '#ffe38a',
  pendingInsuranceForeground: 'rgba(18, 18, 18, 0.73)',
  terminatedInsuranceBackground: '#eb7e7e',
  terminatedInsuranceForeground: 'rgba(18, 18, 18, 0.73)',
}

export const darkTheme: typeof lightTheme = {
  type: 'dark',
  background: colorsV3.gray900,
  backgroundLight: colorsV3.gray800,
  highlightBackground: colorsV3.gray700,
  foreground: colorsV3.white,
  semiStrongForeground: colorsV3.gray300,
  placeholderColor: colorsV3.gray500,
  border: colorsV3.gray700,
  borderStrong: colorsV3.gray300,
  backgroundTransparent: 'rgba(255, 255, 255, .1)',
  highlight: colorsV3.purple500,
  highlightLight: colorsV3.purple700,
  highlightDark: colorsV3.purple300,
  highlightContrast: colorsV3.gray900,
  mutedText: colorsV3.gray500,
  mutedBackground: colorsV3.gray700,
  defaultButtonBackground: colorsV3.gray800,
  highlightedButtonBackground: colorsV3.gray500,
  activeInsuranceBackground: 'rgba(141, 215, 205, 0.2)',
  activeInsuranceForeground: '#8dd7cd',
  pendingInsuranceBackground: 'rgba(255, 253, 162, 0.2)',
  pendingInsuranceForeground: '#fffda2',
  terminatedInsuranceBackground: 'rgba(235, 126, 126, 0.2)',
  terminatedInsuranceForeground: '#eb7e7e',
}

export const SemanticOverrides = styled.div`
  ${({ theme }) => css`
    .ui.breadcrumb a,
    a {
      color: ${theme.highlightDark};
      transition: color 200ms;
      &:hover,
      &:focus {
        color: ${theme.highlightLight};
      }
    }

    .ui.breadcrumb {
      .divider {
        color: ${theme.mutedText};
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
        font-family: ${fonts.FAVORIT}, sans-serif;
        background: ${theme.backgroundLight};
        color: ${theme.foreground};
        border-color: ${theme.border};
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
        border: 1px solid ${theme.border};
        border-radius: 0.5rem;
      }
    }

    .ui.button {
      font-weight: normal;
      font-family: ${fonts.FAVORIT}, sans-serif;
      background: ${theme.foreground};
      color: ${theme.background};
      border-radius: 0.5rem;

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
      border: 0;
      border-radius: 0.5rem;
      overflow: hidden;

      thead th {
        background: ${theme.highlightBackground};
        color: ${theme.foreground};
        border: 0;
        color: ${theme.semiStrongForeground};
        padding: 1rem 2rem 0.5rem 2rem;
      }

      tbody td {
        color: ${theme.foreground};
        border: ${theme.borderStrong};
        background: ${theme.backgroundLight};
        padding: 0.5rem 2rem;
      }

      tr:not(:last-of-type) td {
        border-bottom: 1px solid ${theme.border};
      }
    }

    .ui.segment {
      background: ${theme.background};
      padding: 0;
      border: 0;
      box-shadow: none;
    }

    .ui.tabular.menu {
      padding-bottom: 4rem;
      border-bottom: 0;
      .item {
        padding: 0;
        margin-bottom: 1rem;
        border: 0;
        margin-right: 3rem;
        line-height: 1.5;

        background: transparent;
        color: ${theme.semiStrongForeground};
      }
      .item.active {
        font-weight: normal;
        border-bottom: 2px solid ${theme.foreground};
        background: transparent;
        color: ${theme.foreground};
      }
    }

    .ui.header {
      color: ${theme.foreground};
    }
  `};
`

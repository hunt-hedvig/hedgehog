import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'

export const lightTheme = {
  type: 'light',
  background: colorsV3.gray100,
  backgroundLight: colorsV3.white,
  accentBackground: colorsV3.gray300,
  accentBackgroundHighlight: colorsV3.gray100,
  foreground: colorsV3.gray900,
  semiStrongForeground: colorsV3.gray700,
  placeholderColor: colorsV3.gray500,
  border: '#c6d6e4',
  borderStrong: '#36658f',
  backgroundTransparent: 'rgba(0, 0, 0, .1)',
  backgroundTransparentContrast: 'rgba(255, 255, 255, .4)',
  accent: '#308de5',
  accentLight: '#c6d6e4',
  accentLighter: '#e0eaf3',
  accentSaturated: '#CFE2F2',
  accentContrast: colorsV3.white,
  accentSecondary: colorsV3.gray300,
  accentSecondaryLight: colorsV3.gray100,
  accentSecondaryContrast: colorsV3.gray900,
  accentThird: '#c6d6e4',
  accentThirdLight: '#e0eaf3',
  accentThirdContrast: colorsV3.gray900,
  danger: '#e24646',
  lightDanger: '#eecccc',
  success: '#199381',
  lightSuccess: '#b7eae2',
  warning: '#fbd45b',
  darkWarning: '#a48009',
  lightWarning: '#faeaab',
  highlight: '#c4a8ef',
  darkHighlight: '#491299',
  mutedText: colorsV3.gray500,
  mutedBackground: colorsV3.gray300,
  defaultButtonBackground: colorsV3.gray300,
  highlightedButtonBackground: colorsV3.gray500,
  activeInsuranceBackground: '#199381',
  activeInsuranceForeground: '#fff',
  pendingInsuranceBackground: '#fbd45b',
  pendingInsuranceForeground: '#fff',
  terminatedInsuranceBackground: '#e24646',
  terminatedInsuranceForeground: '#fff',
}

export const darkTheme: typeof lightTheme = {
  type: 'dark',
  background: colorsV3.gray900,
  backgroundLight: colorsV3.gray800,
  accentBackground: colorsV3.gray700,
  accentBackgroundHighlight: colorsV3.gray900,
  foreground: colorsV3.white,
  semiStrongForeground: colorsV3.gray500,
  placeholderColor: colorsV3.gray500,
  border: '#203446',
  borderStrong: '#4581b5',
  backgroundTransparent: 'rgba(255, 255, 255, .1)',
  backgroundTransparentContrast: 'rgba(0, 0, 0, .4)',
  accent: '#4581b5',
  accentLight: '#203446',
  accentLighter: '#192b3c',
  accentSaturated: '#314A61',
  accentContrast: colorsV3.white,
  accentSecondary: colorsV3.gray500,
  accentSecondaryLight: colorsV3.gray700,
  accentSecondaryContrast: colorsV3.gray900,
  accentThird: '#203446',
  accentThirdLight: '#192b3c',
  accentThirdContrast: colorsV3.white,
  danger: '#e24646',
  lightDanger: '#eecccc',
  success: '#199381',
  lightSuccess: '#b7eae2',
  warning: '#fbd45b',
  darkWarning: '#92720f',
  lightWarning: '#efe7ce',
  highlight: '#be9bf3',
  darkHighlight: '#290958',
  mutedText: colorsV3.gray500,
  mutedBackground: colorsV3.gray700,
  defaultButtonBackground: colorsV3.gray800,
  highlightedButtonBackground: colorsV3.gray500,
  activeInsuranceBackground: '#199381',
  activeInsuranceForeground: '#fff',
  pendingInsuranceBackground: '#fbd45b',
  pendingInsuranceForeground: '#fff',
  terminatedInsuranceBackground: '#e24646',
  terminatedInsuranceForeground: '#fff',
}

export const GlobalStyles = css`
  ${getCdnFontFaces()}

  * {
    box-sizing: border-box;
    font-family: ${fonts.FAVORIT}, sans-serif;
    transition: background 1000ms, color 1000ms;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${fonts.FAVORIT}, sans-serif;
    font-kerning: none;
    font-weight: 400;
  }
`

export const BaseStyle = styled.div`
  ${({ theme }) => css`
    a {
      color: ${theme.accent};
      transition: color 200ms;
      &:hover,
      &:focus {
        color: ${theme.accentLight};
      }
    }

    strong {
      color: ${theme.foreground};
    }

      tbody td {
        color: ${theme.foreground};
        border: ${theme.borderStrong};
        background: ${theme.accentLighter};
        padding: 1.125rem;
        border: 0;
        border-top: 1px solid ${theme.border};
      }
      td:first-of-type {
        border-left: 0;
      }
      tr:first-of-type td {
        border-top: 0;
      }

      tr.active td {
        position: relative;
        background: ${theme.accentLight};

        :first-of-type::before {
          content: ' ';
          width: 0;
          height: 0;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-left: 10px solid ${theme.borderStrong};

          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  `};
`

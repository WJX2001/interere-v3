import { FONT } from '@/constants';
import { createTheme, Theme, ThemeOptions } from '@mui/material';

const theme = createTheme();
const {
  typography: { pxToRem },
} = theme;


interface TypographyCustomVariants {
  display1: React.CSSProperties;
  subheader1: React.CSSProperties;
  subheader2: React.CSSProperties;
  description: React.CSSProperties;
  buttonL: React.CSSProperties;
  buttonM: React.CSSProperties;
  buttonS: React.CSSProperties;
  helperText: React.CSSProperties;
  tooltip: React.CSSProperties;
  main21: React.CSSProperties;
  secondary21: React.CSSProperties;
  main16: React.CSSProperties;
  secondary16: React.CSSProperties;
  main14: React.CSSProperties;
  secondary14: React.CSSProperties;
  main12: React.CSSProperties;
  secondary12: React.CSSProperties;
}
declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    default: string;
    paper: string;
    surface: string;
    surface2: string;
    header: string;
    disabled: string;
  }

  interface Palette {
    gradients: {
      aaveGradient: string;
      newGradient: string;
    };
    other: {
      standardInputLine: string;
    };
  }
}
declare module '@mui/material/styles' {
  interface TypographyVariants extends TypographyCustomVariants {}

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions extends TypographyCustomVariants {}

  interface BreakpointOverrides {
    xsm: true;
    xxl: true;
    mdlg: true;
  }
}

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const getColor = (lightColor: string, darkColor: string) =>
    mode === 'dark' ? darkColor : lightColor;

  return {
    breakpoints: {
      keys: ['xs', 'xsm', 'sm', 'md', 'lg', 'xl', 'xxl'],
      values: {
        xs: 0,
        xsm: 640,
        sm: 760,
        md: 960,
        mdlg: 1125,
        lg: 1280,
        xl: 1575,
        xxl: 1800,
      },
    },
    palette: {
      mode,
      primary: {
        main: getColor('#383D51', '#EAEBEF'),
        light: getColor('#62677B', '#F1F1F3'),
        dark: getColor('#292E41', '#D2D4DC'),
        contrast: getColor('#FFFFFF', '#0F121D'),
      },
      secondary: {
        main: getColor('#FF607B', '#F48FB1'),
        light: getColor('#FF607B', '#F6A5C0'),
        dark: getColor('#B34356', '#AA647B'),
      },
      error: {
        main: getColor('#BC0000B8', '#F44336'),
        light: getColor('#D26666', '#E57373'),
        dark: getColor('#BC0000', '#D32F2F'),
        '100': getColor('#4F1919', '#FBB4AF'), // for alert text
        '200': getColor('#F9EBEB', '#2E0C0A'), // for alert background
      },
      warning: {
        main: getColor('#F89F1A', '#FFA726'),
        light: getColor('#FFCE00', '#FFB74D'),
        dark: getColor('#C67F15', '#F57C00'),
        '100': getColor('#63400A', '#FFDCA8'), // for alert text
        '200': getColor('#FEF5E8', '#301E04'), // for alert background
      },
      info: {
        main: getColor('#0062D2', '#29B6F6'),
        light: getColor('#0062D2', '#4FC3F7'),
        dark: getColor('#002754', '#0288D1'),
        '100': getColor('#002754', '#A9E2FB'), // for alert text
        '200': getColor('#E5EFFB', '#071F2E'), // for alert background
      },
      success: {
        main: getColor('#4CAF50', '#66BB6A'),
        light: getColor('#90FF95', '#90FF95'),
        dark: getColor('#318435', '#388E3C'),
        '100': getColor('#1C4B1E', '#C2E4C3'), // for alert text
        '200': getColor('#ECF8ED', '#0A130B'), // for alert background
      },
      text: {
        primary: getColor('#303549', '#F1F1F3'),
        secondary: getColor('#62677B', '#A5A8B6'),
        disabled: getColor('#D2D4DC', '#62677B'),
        muted: getColor('#A5A8B6', '#8E92A3'),
        highlight: getColor('#383D51', '#C9B3F9'),
      },
      background: {
        default: getColor('#F1F1F3', '#1B2030'),
        paper: getColor('#FFFFFF', '#292E41'),
        surface: getColor('#F7F7F9', '#383D51'),
        surface2: getColor('#F9F9FB', '#383D51'),
        header: getColor('#2B2D3C', '#1B2030'),
        disabled: getColor('#EAEBEF', '#EBEBEF14'),
      },
      divider: getColor('#EAEBEF', '#EBEBEF14'),
      action: {
        active: getColor('#8E92A3', '#EBEBEF8F'),
        hover: getColor('#F1F1F3', '#EBEBEF14'),
        selected: getColor('#EAEBEF', '#EBEBEF29'),
        disabled: getColor('#BBBECA', '#EBEBEF4D'),
        disabledBackground: getColor('#EAEBEF', '#EBEBEF1F'),
        focus: getColor('#F1F1F3', '#EBEBEF1F'),
      },
      other: {
        standardInputLine: getColor('#383D511F', '#EBEBEF6B'),
      },
      gradients: {
        aaveGradient:
          'linear-gradient(248.86deg, #B6509E 10.51%, #2EBAC6 93.41%)',
        newGradient: 'linear-gradient(79.67deg, #8C3EBC 0%, #007782 95.82%)',
      },
    },
    spacing: 4,
    typography: {
      fontFamily: FONT,
      h5: undefined,
      h6: undefined,
      subtitle1: undefined,
      subtitle2: undefined,
      body1: undefined,
      body2: undefined,
      button: undefined,
      overline: undefined,
      display1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: '123.5%',
        fontSize: pxToRem(32),
      },
      h1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: '123.5%',
        fontSize: pxToRem(28),
      },
      h2: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: 'unset',
        lineHeight: '133.4%',
        fontSize: pxToRem(21),
      },
      h3: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: '160%',
        fontSize: pxToRem(18),
      },
      h4: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      subheader1: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      subheader2: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      description: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: '143%',
        fontSize: pxToRem(14),
      },
      caption: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      buttonL: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      buttonM: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: pxToRem(24),
        fontSize: pxToRem(14),
      },
      buttonS: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(20),
        textTransform: 'uppercase',
        fontSize: pxToRem(10),
      },
      helperText: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.4),
        lineHeight: pxToRem(12),
        fontSize: pxToRem(10),
      },
      tooltip: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      main21: {
        fontFamily: FONT,
        fontWeight: 800,
        lineHeight: '133.4%',
        fontSize: pxToRem(21),
      },
      secondary21: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: '133.4%',
        fontSize: pxToRem(21),
      },
      main16: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      secondary16: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      main14: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      secondary14: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      main12: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      secondary12: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
    },
  } as ThemeOptions;
};

export function getThemedComponents(theme: Theme) {
  return {
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
          sizeLarge: {
            ...theme.typography.buttonL,
            padding: '10px 24px',
          },
          sizeMedium: {
            ...theme.typography.buttonM,
            padding: '6px 12px',
          },
          sizeSmall: {
            ...theme.typography.buttonS,
            padding: '0 6px',
          },
        },
        variants: [
          {
            props: { variant: 'surface' },
            style: {
              color: theme.palette.common.white,
              border: '1px solid',
              borderColor: '#EBEBED1F',
              backgroundColor: '#383D51',
              '&:hover, &.Mui-focusVisible': {
                backgroundColor: theme.palette.background.header,
              },
            },
          },
          {
            props: { variant: 'gradient' },
            style: {
              color: theme.palette.common.white,
              background: theme.palette.gradients.aaveGradient,
              transition: 'all 0.2s ease',
              '&:hover, &.Mui-focusVisible': {
                background: theme.palette.gradients.aaveGradient,
                opacity: '0.9',
              },
            },
          },
          {
            props: { color: 'primary', variant: 'outlined' },
            style: {
              background: theme.palette.background.surface,
              borderColor: theme.palette.divider,
            },
          },
        ],
      },
      MuiList: {
        styleOverrides: {
          root: {
            '.MuiMenuItem-root+.MuiDivider-root, .MuiDivider-root': {
              marginTop: '4px',
              marginBottom: '4px',
            },
          },
          padding: {
            paddingTop: '4px',
            paddingBottom: '4px',
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingBottom: '39px',
            [theme.breakpoints.up('xs')]: {
              paddingLeft: '8px',
              paddingRight: '8px',
            },
            [theme.breakpoints.up('xsm')]: {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
            [theme.breakpoints.up('sm')]: {
              paddingLeft: '48px',
              paddingRight: '48px',
            },
            [theme.breakpoints.up('md')]: {
              paddingLeft: '96px',
              paddingRight: '96px',
            },
            [theme.breakpoints.up('lg')]: {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
            [theme.breakpoints.up('xl')]: {
              maxWidth: 'unset',
              paddingLeft: '96px',
              paddingRight: '96px',
            },
            [theme.breakpoints.up('xxl')]: {
              paddingLeft: 0,
              paddingRight: 0,
              maxWidth: '1440px',
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: pxToRem(14),
            minWidth: '375px',
            '> div:first-of-type': {
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        },
      },
    },
  };
}

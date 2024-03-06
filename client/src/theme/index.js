import { createTheme } from '@mui/material/styles'

const palette = {
  custom: {
    main: '#c8e0fc',
    dark: '#3787eb',
    darker: '#1464c7',
    textMain: '#111541',
    textDark: '#ffffff',
  },
  util: {
    main: 'rgb(255, 255, 255)',
    light: 'rgb(255, 255, 255)',
    lightDark: 'rgba(0, 0, 0, 0.05)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darkest: 'rgb(0, 0, 0)',
    darkTransparent: 'rgba(0, 0, 0, 0.06)',
    shadow: 'rgba(86, 100, 104, 0.16)',
    green: '#589054',
    red: '#d34463',
    redTransparent: 'rgba(211, 68, 99, 0.3)',
  },
}

export default createTheme({
  palette,
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'main' },
          style: data => {
            return {
              fontSize: data.theme.typography.body1.fontSize,
              padding: '8px 40px',
              backgroundColor: palette.custom.dark,
              color: palette.custom.textDark,
              borderRadius: '15px',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: palette.custom.darker,
              },
            }
          },
        },
        {
          props: { variant: 'app-bar' },
          style: data => {
            return {
              backgroundColor: 'transparent',
              color: palette.custom.textDark,
              border: 'none',
              borderRadius: '12px',
              textTransform: 'capitalize',
              fontSize: data.theme.typography.body2.fontSize,
              '&:hover': {
                backgroundColor: palette.custom.main,
                color: palette.custom.textMain,
              },
            }
          },
        },
        {
          props: { variant: 'ordinary' },
          style: data => {
            return {
              backgroundColor: palette.custom.main,
              color: palette.custom.textMain,
              border: 'none',
              borderRadius: '12px',
              textTransform: 'capitalize',
              fontSize: data.theme.typography.body2.fontSize,
              '&:hover': {
                backgroundColor: palette.custom.dark,
                color: palette.custom.textDark,
              },
            }
          },
        },
        {
          props: { variant: 'danger' },
          style: {
            color: `${palette.util.red}`,
            borderRadius: '12px',
            textTransform: 'capitalize',
            '&:hover': {
              backgroundColor: `${palette.util.redTransparent}`,
            },
          },
        },
      ],
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          backgroundColor: palette.custom.main,
          color: palette.custom.textMain,
          border: 'none',
          borderRadius: '12px',
          textTransform: 'capitalize',
          '&:hover, &.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: palette.custom.dark,
            color: palette.custom.textDark,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          display: 'block',
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: 'auth' },
          style: data => {
            return {
              width: '500px',
              padding: '35px 40px',
              paddingTop: '50px',
              boxShadow: data.theme.shadows[data.ownerState.elevation.toString()],
            }
          },
        },
      ],
    },
  },
})

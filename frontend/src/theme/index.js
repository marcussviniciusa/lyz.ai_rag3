import { createTheme } from '@mui/material/styles';

// Definindo uma paleta de cores adaptada ao pu00fablico feminino
const palette = {
  primary: {
    main: '#9C27B0',    // Roxo principal
    light: '#D1C4E9',  // Roxo claro
    dark: '#7B1FA2',   // Roxo escuro
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#FF4081',    // Rosa intenso
    light: '#FF80AB',  // Rosa claro
    dark: '#C2185B',   // Rosa escuro
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#F8F6FD',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#424242',
    secondary: '#757575',
  },
  error: {
    main: '#F44336',
    light: '#FFCDD2',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FFA726',
    light: '#FFECB3',
    dark: '#F57C00',
  },
  info: {
    main: '#29B6F6',
    light: '#B3E5FC',
    dark: '#0288D1',
  },
  success: {
    main: '#66BB6A',
    light: '#DCEDC8',
    dark: '#388E3C',
  },
};

// Definindo as transiu00e7u00f5es
const transitions = {
  easing: {
    // Acelerau00e7u00e3o mais suave para transiu00e7u00f5es
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Entrada ru00e1pida, sau00edda lenta
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    // Entrada lenta, sau00edda ru00e1pida
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    // Efeito de mola
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
};

// Tema personalizado
const theme = createTheme({
  palette,
  transitions,
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 6px 12px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 10px 20px rgba(0, 0, 0, 0.05)',
    '0px 12px 24px rgba(0, 0, 0, 0.05)',
    '0px 14px 28px rgba(0, 0, 0, 0.05)',
    '0px 16px 32px rgba(0, 0, 0, 0.05)',
    '0px 18px 36px rgba(0, 0, 0, 0.05)',
    '0px 20px 40px rgba(0, 0, 0, 0.05)',
    '0px 22px 44px rgba(0, 0, 0, 0.05)',
    '0px 24px 48px rgba(0, 0, 0, 0.05)',
    '0px 26px 52px rgba(0, 0, 0, 0.05)',
    '0px 28px 56px rgba(0, 0, 0, 0.05)',
    '0px 30px 60px rgba(0, 0, 0, 0.05)',
    '0px 32px 64px rgba(0, 0, 0, 0.05)',
    '0px 34px 68px rgba(0, 0, 0, 0.05)',
    '0px 36px 72px rgba(0, 0, 0, 0.05)',
    '0px 38px 76px rgba(0, 0, 0, 0.05)',
    '0px 40px 80px rgba(0, 0, 0, 0.05)',
    '0px 42px 84px rgba(0, 0, 0, 0.05)',
    '0px 44px 88px rgba(0, 0, 0, 0.05)',
    '0px 46px 92px rgba(0, 0, 0, 0.05)',
    '0px 48px 96px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          transition: `all ${transitions.duration.standard}ms ${transitions.easing.easeInOut}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: '#E0E0E0',
            color: '#9E9E9E',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.08)',
          transition: `all ${transitions.duration.standard}ms ${transitions.easing.easeInOut}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 25px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: `all ${transitions.duration.shortest}ms ${transitions.easing.easeInOut}`,
            '&.Mui-focused': {
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            backgroundColor: palette.primary.light,
            color: palette.primary.dark,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: palette.secondary.light,
            color: palette.secondary.dark,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
        },
      },
    },
  },
});

export default theme;

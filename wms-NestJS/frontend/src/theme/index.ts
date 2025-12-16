import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#6366f1',
			light: '#818cf8',
			dark: '#4f46e5',
		},
		secondary: {
			main: '#8b5cf6',
			light: '#a78bfa',
			dark: '#7c3aed',
		},
		background: {
			default: '#0a0a0f',
			paper: '#13131a',
		},
		error: {
			main: '#ef4444',
		},
		success: {
			main: '#10b981',
		},
		warning: {
			main: '#f59e0b',
		},
		text: {
			primary: '#ffffff',
			secondary: '#a1a1aa',
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontWeight: 700,
		},
		h2: {
			fontWeight: 700,
		},
		h3: {
			fontWeight: 600,
		},
		h4: {
			fontWeight: 600,
		},
		h5: {
			fontWeight: 500,
		},
		h6: {
			fontWeight: 500,
		},
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 500,
					padding: '10px 24px',
				},
				contained: {
					boxShadow: 'none',
					'&:hover': {
						boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
					},
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: 'outlined',
				fullWidth: true,
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					backgroundColor: 'rgba(19, 19, 26, 0.8)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
				},
			},
		},
	},
});

export default theme;

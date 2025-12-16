import React, { useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Alert,
	CircularProgress,
	Link,
	InputAdornment,
	IconButton,
} from '@mui/material';
import {
	Visibility,
	VisibilityOff,
	Warehouse as WarehouseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const LoginPage: React.FC = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			if (isSignUp) {
				await authService.signUp(username, password);
			} else {
				await authService.signIn(username, password);
			}
			navigate('/');
		} catch (err: any) {
			const message = err.response?.data?.message || err.message || 'Ocurrió un error';
			setError(message === 'Unauthorized' ? 'Credenciales incorrectas' : message);
		} finally {
			setLoading(false);
		}
	};

	const toggleMode = () => {
		setIsSignUp(!isSignUp);
		setError('');
	};

	return (
		<Card
			sx={{
				maxWidth: 420,
				width: '100%',
				mx: 'auto',
			}}
		>
			<CardContent sx={{ p: 4 }}>
				{/* Header */}
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Box
						sx={{
							width: 64,
							height: 64,
							mx: 'auto',
							mb: 2,
							borderRadius: 2,
							background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
						}}
					>
						<WarehouseIcon sx={{ fontSize: 32, color: 'white' }} />
					</Box>
					<Typography variant="h4" fontWeight={700} gutterBottom>
						WMS
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Sistema de Gestión de Almacenes
					</Typography>
				</Box>

				{/* Error Alert */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				{/* Form */}
				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						label="Usuario"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						autoComplete="username"
						sx={{ mb: 2 }}
					/>

					<TextField
						label="Contraseña"
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete={isSignUp ? 'new-password' : 'current-password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
						sx={{ mb: 3 }}
					/>

					<Button
						type="submit"
						variant="contained"
						fullWidth
						size="large"
						disabled={loading || !username || !password}
						sx={{ mb: 2 }}
					>
						{loading ? (
							<CircularProgress size={24} color="inherit" />
						) : isSignUp ? (
							'Crear Cuenta'
						) : (
							'Iniciar Sesión'
						)}
					</Button>
				</Box>

				{/* Toggle Mode */}
				<Box sx={{ textAlign: 'center', mt: 2 }}>
					<Typography variant="body2" color="text.secondary">
						{isSignUp ? '¿Ya tienes una cuenta?' : "¿No tienes una cuenta?"}{' '}
						<Link
							component="button"
							type="button"
							onClick={toggleMode}
							sx={{ cursor: 'pointer' }}
						>
							{isSignUp ? 'Iniciar Sesión' : 'Crear Cuenta'}
						</Link>
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default LoginPage;

import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Logout as LogoutIcon, Warehouse as WarehouseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		authService.logout();
		navigate('/login');
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<AppBar
				position="static"
				sx={{
					background: 'rgba(19, 19, 26, 0.9)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
				}}
			>
				<Toolbar>
					<WarehouseIcon sx={{ mr: 2, color: 'primary.main' }} />
					<Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
						WMS Dashboard
					</Typography>
					<Button
						color="inherit"
						onClick={handleLogout}
						startIcon={<LogoutIcon />}
						sx={{
							borderRadius: 2,
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
							}
						}}
					>
						Cerrar Sesión
					</Button>
				</Toolbar>
			</AppBar>

			<Box component="main" sx={{ flexGrow: 1, py: 4 }}>
				<Container maxWidth="xl">
					{children}
				</Container>
			</Box>
		</Box>
	);
};

export default MainLayout;

import React, { useEffect, useState } from 'react';
import {
	Box,
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
	LinearProgress,
	Button,
	CircularProgress,
	Divider
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Inventory2 as InventoryIcon,
	Warehouse as WarehouseIcon,
	Percent as PercentIcon,
	Category as CategoryIcon,
	Layers as LayersIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import statisticsService, { DashboardStats } from '../../services/statisticsService';

const StatisticsPage: React.FC = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			const data = await statisticsService.getDashboardStats();
			setStats(data);
		} catch (err) {
			console.error(err);
			setError('Error al cargar las estadísticas');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error || !stats) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Typography color="error" variant="h6">{error || 'No hay datos disponibles'}</Typography>
				<Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }} variant="contained">
					Volver
				</Button>
			</Box>
		);
	}

	return (
		<Box>
			<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate('/dashboard')}
					variant="outlined"
					sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
				>
					Volver
				</Button>
				<Typography variant="h4" fontWeight={600}>
					Estadísticas del Almacén
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Ocupación */}
				<Grid item xs={12} md={6}>
					<Card sx={{ height: '100%', bgcolor: 'rgba(30, 41, 59, 0.7)', color: 'white' }}>
						<CardContent>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<PercentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
								<Typography variant="h5" fontWeight="bold">
									Ocupación de Ubicaciones
								</Typography>
							</Box>
							<Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
								<Typography variant="h3" fontWeight="bold" color={stats?.occupancyPercentage > 90 ? 'error.main' : 'primary.light'}>
									{stats?.occupancyPercentage}%
								</Typography>
								<Typography variant="body1" color="gray">
									{stats?.occupiedUbications} de {stats?.totalUbications} ocupadas
								</Typography>
							</Box>
							<LinearProgress
								variant="determinate"
								value={stats?.occupancyPercentage || 0}
								sx={{
									height: 15,
									borderRadius: 5,
									bgcolor: 'rgba(255,255,255,0.1)',
									'& .MuiLinearProgress-bar': {
										bgcolor: stats?.occupancyPercentage > 90 ? 'error.main' : 'primary.main'
									}
								}}
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Total Ubicaciones */}
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ height: '100%', bgcolor: 'rgba(30, 41, 59, 0.7)', color: 'white' }}>
						<CardContent sx={{ textAlign: 'center' }}>
							<WarehouseIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
							<Typography variant="h6" color="gray">Total Ubicaciones</Typography>
							<Typography variant="h3" fontWeight="bold">{stats?.totalUbications}</Typography>
						</CardContent>
					</Card>
				</Grid>

				{/* Total Productos */}
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ height: '100%', bgcolor: 'rgba(30, 41, 59, 0.7)', color: 'white' }}>
						<CardContent sx={{ textAlign: 'center' }}>
							<CategoryIcon sx={{ fontSize: 50, color: 'success.main', mb: 1 }} />
							<Typography variant="h6" color="gray">Productos Únicos</Typography>
							<Typography variant="h3" fontWeight="bold">{stats?.totalProducts}</Typography>
						</CardContent>
					</Card>
				</Grid>

				{/* Lotes */}
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ height: '100%', bgcolor: 'rgba(30, 41, 59, 0.7)', color: 'white' }}>
						<CardContent sx={{ textAlign: 'center' }}>
							<LayersIcon sx={{ fontSize: 50, color: 'info.main', mb: 1 }} />
							<Typography variant="h6" color="gray">Lotes Activos</Typography>
							<Typography variant="h3" fontWeight="bold">{stats?.totalBatches}</Typography>
						</CardContent>
					</Card>
				</Grid>

				{/* Total Stock Items (Approximation) */}
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ height: '100%', bgcolor: 'rgba(30, 41, 59, 0.7)', color: 'white' }}>
						<CardContent sx={{ textAlign: 'center' }}>
							<InventoryIcon sx={{ fontSize: 50, color: 'warning.main', mb: 1 }} />
							<Typography variant="h6" color="gray">Total Unidades</Typography>
							<Typography variant="h3" fontWeight="bold">{stats?.totalStockItems.toLocaleString()}</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default StatisticsPage;

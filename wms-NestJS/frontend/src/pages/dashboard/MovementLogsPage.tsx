import React, { useEffect, useState } from 'react';
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	CircularProgress,
	Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import movementService, { MovementLog } from '../../services/movementService';

const MovementLogsPage: React.FC = () => {
	const [movements, setMovements] = useState<MovementLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		loadMovements();
	}, []);

	const loadMovements = async () => {
		try {
			const data = await movementService.getAllMovementLogs();
			setMovements(data);
		} catch (err) {
			setError('Error al cargar los movimientos');
			console.error(err);
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

	return (
		<Box>
			<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate('/')}
					variant="outlined"
					sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
				>
					Volver
				</Button>
				<Typography variant="h4" fontWeight={600}>
					Historial de Movimientos
				</Typography>
			</Box>

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}

			<TableContainer component={Paper} sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Producto</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Cantidad</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Origen</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Destino</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Usuario</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Fecha</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{movements.map((row) => (
							<TableRow key={row.movement_log_id} hover>
								<TableCell>{row.movement_log_id}</TableCell>
								<TableCell>{row.productEntity?.reference || row.product_id}</TableCell>
								<TableCell>{row.amount}</TableCell>
								<TableCell>{row.fromUbicationEntity ? `${row.fromUbicationEntity.hallway}-${row.fromUbicationEntity.position}-${row.fromUbicationEntity.height}-${row.fromUbicationEntity.depth}` : '-'}</TableCell>
								<TableCell>{row.toUbicationEntity ? `${row.toUbicationEntity.hallway}-${row.toUbicationEntity.position}-${row.toUbicationEntity.height}-${row.toUbicationEntity.depth}` : '-'}</TableCell>
								<TableCell>{row.userEntity ? row.userEntity.username : `ID: ${row.user_id}`}</TableCell>
								<TableCell>
									{new Date(row.timestamp).toLocaleString()}
								</TableCell>
							</TableRow>
						))}
						{movements.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No hay movimientos registrados
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default MovementLogsPage;

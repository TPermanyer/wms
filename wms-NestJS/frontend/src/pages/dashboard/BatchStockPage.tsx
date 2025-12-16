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
import { useNavigate, useParams } from 'react-router-dom';
import productUbicationService, { ProductUbication } from '../../services/productUbicationService';

const BatchStockPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [items, setItems] = useState<ProductUbication[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			loadData(parseInt(id));
		}
	}, [id]);

	const loadData = async (batchId: number) => {
		try {
			const itemsData = await productUbicationService.getProductUbicationsByBatchId(batchId);
			setItems(itemsData);
		} catch (err) {
			setError('Error al cargar el stock del lote');
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
					onClick={() => navigate('/batches')}
					variant="outlined"
					sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
				>
					Volver
				</Button>
				<Typography variant="h4" fontWeight={600}>
					Ubicaciones del Lote {id}
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
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Referencia Producto</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Descripción</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Ubicación</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Pasillo</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Posición</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Cantidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((row) => (
							<TableRow key={row.product_ubication_id} hover>
								<TableCell sx={{ fontWeight: 'bold' }}>
									{row.productEntity?.reference || row.product_id}
								</TableCell>
								<TableCell>{row.productEntity?.description || '-'}</TableCell>
								<TableCell sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
									{row.ubicationEntity ? `${row.ubicationEntity.hallway}-${row.ubicationEntity.position}-${row.ubicationEntity.height}-${row.ubicationEntity.depth}` : row.ubication_id}
								</TableCell>
								<TableCell>{row.ubicationEntity?.hallway ?? '-'}</TableCell>
								<TableCell>{row.ubicationEntity?.position ?? '-'}</TableCell>
								<TableCell sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>{row.amount}</TableCell>
							</TableRow>
						))}
						{items.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Este lote no tiene stock registrado en ninguna ubicación
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default BatchStockPage;

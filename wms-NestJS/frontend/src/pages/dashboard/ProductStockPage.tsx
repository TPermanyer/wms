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

const ProductStockPage: React.FC = () => {
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

	const loadData = async (productId: number) => {
		try {
			const itemsData = await productUbicationService.getProductUbicationsByProductId(productId);
			setItems(itemsData);
		} catch (err) {
			setError('Error al cargar el stock del producto');
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
					onClick={() => navigate('/products')}
					variant="outlined"
					sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
				>
					Volver
				</Button>
				<Typography variant="h4" fontWeight={600}>
					Stock del Producto {id}
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
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Ubicación</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Pasillo</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Posición</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Lote</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Vencimiento (FEFO)</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Cantidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((row) => (
							<TableRow key={row.product_ubication_id} hover>
								<TableCell sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
									{row.ubicationEntity ? `${row.ubicationEntity.hallway}-${row.ubicationEntity.position}-${row.ubicationEntity.height}-${row.ubicationEntity.depth}` : row.ubication_id}
								</TableCell>
								<TableCell>{row.ubicationEntity?.hallway ?? '-'}</TableCell>
								<TableCell>{row.ubicationEntity?.position ?? '-'}</TableCell>
								<TableCell>{row.batchEntity?.batch || row.batch_id}</TableCell>
								<TableCell sx={{ color: row.batchEntity?.expiry_date && new Date(row.batchEntity.expiry_date) < new Date() ? 'error.main' : 'inherit' }}>
									{row.batchEntity?.expiry_date ? new Date(row.batchEntity.expiry_date).toLocaleDateString() : '-'}
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>{row.amount}</TableCell>
							</TableRow>
						))}
						{items.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Este producto no tiene stock registrado
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box >
	);
};

export default ProductStockPage;

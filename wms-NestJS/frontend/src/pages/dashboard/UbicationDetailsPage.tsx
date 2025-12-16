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
import { ArrowBack as ArrowBackIcon, SwapHoriz as SwapHorizIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import productUbicationService, { ProductUbication } from '../../services/productUbicationService';
import ubicationService, { Ubication } from '../../services/ubicationService';

const UbicationDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [items, setItems] = useState<ProductUbication[]>([]);
	const [ubication, setUbication] = useState<Ubication | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			loadData(parseInt(id));
		}
	}, [id]);

	const loadData = async (ubicationId: number) => {
		try {
			// Load ubication details for context (optional, but good for header)
			// Since we don't have getById exposed nicely or optimized, we might skip or do a find from "getAll" if cached, 
			// but for now let's just fetch the items. 
			// Ideally we would fetch ubication info too.

			const itemsData = await productUbicationService.getProductUbicationByUbicationId(ubicationId);
			setItems(itemsData);

		} catch (err) {
			setError('Error al cargar los detalles de la ubicación');
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
					onClick={() => navigate('/ubications')}
					variant="outlined"
					sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
				>
					Volver
				</Button>
				<Typography variant="h4" fontWeight={600} sx={{ flexGrow: 1 }}>
					Detalle de Ubicación {id}
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					startIcon={<SwapHorizIcon />}
					onClick={() => navigate('/move-products', { state: { sourceUbicationId: parseInt(id!) } })}
				>
					Mover Productos
				</Button>
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
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Referencia</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Descripción</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Lote</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Vencimiento</TableCell>
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
								<TableCell>{row.batchEntity?.batch || row.batch_id}</TableCell>
								<TableCell>
									{row.batchEntity?.expiry_date ? new Date(row.batchEntity.expiry_date).toLocaleDateString() : '-'}
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>{row.amount}</TableCell>
							</TableRow>
						))}
						{items.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align="center">
									Esta ubicación está vacía
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default UbicationDetailsPage;

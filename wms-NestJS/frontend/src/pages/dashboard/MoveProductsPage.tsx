import React, { useEffect, useState } from 'react';
import {
	Box,
	Paper,
	Typography,
	Button,
	FormControl,
	Grid,
	List,
	ListItem,
	ListItemText,
	TextField,
	Divider,
	CircularProgress,
	Autocomplete
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, SwapHoriz as SwapHorizIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ubicationService, { Ubication } from '../../services/ubicationService';
import productUbicationService, { ProductUbication } from '../../services/productUbicationService';

const MoveProductsPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [ubications, setUbications] = useState<Ubication[]>([]);
	const [loading, setLoading] = useState(false);

	const [sourceUbicationId, setSourceUbicationId] = useState<number | ''>('');
	const [destUbicationId, setDestUbicationId] = useState<number | ''>('');

	const [sourceProducts, setSourceProducts] = useState<ProductUbication[]>([]);
	const [destProducts, setDestProducts] = useState<ProductUbication[]>([]);

	const [selectedProduct, setSelectedProduct] = useState<ProductUbication | null>(null);
	const [amountToMove, setAmountToMove] = useState<number | ''>('');

	useEffect(() => {
		loadUbications();
		// Check for initial state
		const state = location.state as { sourceUbicationId?: number } | null;
		if (state?.sourceUbicationId) {
			setSourceUbicationId(state.sourceUbicationId);
		}
	}, []);

	useEffect(() => {
		if (sourceUbicationId) {
			loadSourceProducts(sourceUbicationId as number);
		} else {
			setSourceProducts([]);
		}
	}, [sourceUbicationId]);

	useEffect(() => {
		if (destUbicationId) {
			loadDestProducts(destUbicationId as number);
		} else {
			setDestProducts([]);
		}
	}, [destUbicationId]);

	const loadUbications = async () => {
		try {
			const data = await ubicationService.getAllUbications();
			setUbications(data);
		} catch (error) {
			alert('Error al cargar ubicaciones');
		}
	};

	const loadSourceProducts = async (id: number) => {
		try {
			const data = await productUbicationService.getProductUbicationByUbicationId(id);
			setSourceProducts(data);
		} catch (error) {
			alert('Error al cargar productos de origen');
		}
	};

	const loadDestProducts = async (id: number) => {
		try {
			const data = await productUbicationService.getProductUbicationByUbicationId(id);
			setDestProducts(data);
		} catch (error) {
			alert('Error al cargar productos de destino');
		}
	};

	const handleMoveAll = async () => {
		if (!sourceUbicationId || !destUbicationId) return;
		if (sourceUbicationId === destUbicationId) {
			alert('El origen y el destino deben ser diferentes');
			return;
		}
		if (sourceProducts.length === 0) {
			alert('No hay productos para mover');
			return;
		}

		if (!window.confirm('¿Está seguro de mover TODOS los productos?')) return;

		setLoading(true);
		try {
			await productUbicationService.moveAllProductsFromUbicationToUbication({
				from_ubication_id: sourceUbicationId as number,
				to_ubication_id: destUbicationId as number
			});
			alert('Todos los productos movidos con éxito');
			// Reload
			loadSourceProducts(sourceUbicationId as number);
			loadDestProducts(destUbicationId as number);
			setSelectedProduct(null);
			setAmountToMove('');
		} catch (error) {
			console.error(error);
			alert('Error al mover productos');
		} finally {
			setLoading(false);
		}
	};

	const handleMoveSelected = async () => {
		if (!selectedProduct || !sourceUbicationId || !destUbicationId) return;
		if (!amountToMove || Number(amountToMove) <= 0) {
			alert('Por favor ingrese una cantidad válida');
			return;
		}
		if (Number(amountToMove) > selectedProduct.amount) {
			alert('La cantidad excede el stock disponible');
			return;
		}

		setLoading(true);
		try {
			await productUbicationService.moveProductFromUbicationToUbication({
				from_ubication_id: sourceUbicationId as number,
				to_ubication_id: destUbicationId as number,
				product_id: selectedProduct.product_id,
				batch_id: selectedProduct.batch_id,
				amount: Number(amountToMove)
			});
			alert('Producto movido con éxito');
			loadSourceProducts(sourceUbicationId as number);
			loadDestProducts(destUbicationId as number);
			if (Number(amountToMove) === selectedProduct.amount) {
				setSelectedProduct(null);
				setAmountToMove('');
			} else {
				setSelectedProduct(null);
				setAmountToMove('');
			}
		} catch (error) {
			console.error(error);
			alert('Error al mover producto');
		} finally {
			setLoading(false);
		}
	};

	const formatUbicationLabel = (u: Ubication) => {
		return `${u.hallway}-${u.position}-${u.height}-${u.depth}`;
	};

	return (
		<Box p={3}>
			<Box display="flex" alignItems="center" mb={3}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate('/ubications')}
					sx={{ mr: 2 }}
				>
					Volver
				</Button>
				<Typography variant="h4">Mover Productos</Typography>
			</Box>

			<Grid container spacing={3}>
				{/* Source Selection */}
				<Grid item xs={12} md={5}>
					<Paper sx={{ p: 2, height: '100%' }}>
						<Typography variant="h6" gutterBottom>Ubicación de Origen</Typography>
						<FormControl fullWidth margin="normal">
							<Autocomplete
								value={ubications.find(u => u.ubication_id === sourceUbicationId) || null}
								onChange={(_, newValue) => {
									setSourceUbicationId(newValue ? newValue.ubication_id : '');
								}}
								options={ubications}
								getOptionLabel={(option) => formatUbicationLabel(option)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Seleccionar Origen (Buscar...)"
										variant="outlined"
									/>
								)}
							/>
						</FormControl>

						<Divider sx={{ my: 2 }} />
						<Typography variant="subtitle1">Contenido:</Typography>
						<List sx={{ maxHeight: 300, overflow: 'auto' }}>
							{sourceProducts.length === 0 ? (
								<Typography variant="body2" color="textSecondary">Vacío</Typography>
							) : (
								sourceProducts.map((p) => (
									<ListItem
										key={p.product_ubication_id}
										button
										selected={selectedProduct?.product_ubication_id === p.product_ubication_id}
										onClick={() => {
											setSelectedProduct(p);
											setAmountToMove(p.amount);
										}}
									>
										<ListItemText
											primary={`${p.productEntity?.reference} - ${p.productEntity?.description}`}
											secondary={`Lote: ${p.batchEntity?.batch} | Cant: ${p.amount}`}
										/>
									</ListItem>
								))
							)}
						</List>
					</Paper>
				</Grid>

				{/* Controls */}
				<Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						startIcon={<SwapHorizIcon />}
						onClick={handleMoveAll}
						disabled={!sourceUbicationId || !destUbicationId || sourceProducts.length === 0 || loading}
						sx={{ mb: 4 }}
					>
						Mover Todo
					</Button>

					<Paper sx={{ p: 2, width: '100%' }}>
						<Typography variant="subtitle2" align="center" gutterBottom>Movimiento Parcial</Typography>
						{selectedProduct ? (
							<>
								<Typography variant="caption" display="block" align="center" gutterBottom>
									{selectedProduct.productEntity?.reference} <br />
									Lote: {selectedProduct.batchEntity?.batch}
								</Typography>
								<TextField
									label="Cantidad"
									type="number"
									size="small"
									fullWidth
									value={amountToMove}
									onChange={(e) => setAmountToMove(parseInt(e.target.value) || '')}
									sx={{ mb: 2 }}
								/>
								<Button
									variant="contained"
									color="secondary"
									fullWidth
									onClick={handleMoveSelected}
									disabled={loading}
								>
									Mover
								</Button>
							</>
						) : (
							<Typography variant="caption" color="textSecondary" align="center" display="block">
								Seleccione un producto del origen para mover una cantidad específica.
							</Typography>
						)}
					</Paper>
				</Grid>

				{/* Destination Selection */}
				<Grid item xs={12} md={5}>
					<Paper sx={{ p: 2, height: '100%' }}>
						<Typography variant="h6" gutterBottom>Ubicación de Destino</Typography>
						<FormControl fullWidth margin="normal">
							<Autocomplete
								value={ubications.find(u => u.ubication_id === destUbicationId) || null}
								onChange={(_, newValue) => {
									setDestUbicationId(newValue ? newValue.ubication_id : '');
								}}
								options={ubications}
								getOptionLabel={(option) => formatUbicationLabel(option)}
								getOptionDisabled={(option) => option.ubication_id === sourceUbicationId}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Seleccionar Destino (Buscar...)"
										variant="outlined"
									/>
								)}
							/>
						</FormControl>

						<Divider sx={{ my: 2 }} />
						<Typography variant="subtitle1">Contenido Actual:</Typography>
						<List sx={{ maxHeight: 300, overflow: 'auto' }}>
							{destProducts.length === 0 ? (
								<Typography variant="body2" color="textSecondary">Vacío</Typography>
							) : (
								destProducts.map((p) => (
									<ListItem key={p.product_ubication_id}>
										<ListItemText
											primary={`${p.productEntity?.reference} - ${p.productEntity?.description}`}
											secondary={`Lote: ${p.batchEntity?.batch} | Cant: ${p.amount}`}
										/>
									</ListItem>
								))
							)}
						</List>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default MoveProductsPage;

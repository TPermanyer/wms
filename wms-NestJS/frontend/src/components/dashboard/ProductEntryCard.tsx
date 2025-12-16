import React, { useState, useEffect } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Autocomplete,
	Button,
	Grid,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper
} from '@mui/material';
import {
	Add as AddIcon,
	Save as SaveIcon,
	Delete as DeleteIcon
} from '@mui/icons-material';
import productService, { Product } from '../../services/productService';
import batchService, { Batch } from '../../services/batchService';
import ubicationService, { Ubication } from '../../services/ubicationService';
import productUbicationService from '../../services/productUbicationService';

interface UbicationEntry {
	ubication: Ubication;
	amount: number;
}

const ProductEntryCard: React.FC = () => {
	// Data States
	const [products, setProducts] = useState<Product[]>([]);
	const [batches, setBatches] = useState<Batch[]>([]);
	const [ubications, setUbications] = useState<Ubication[]>([]);

	// Selection States
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
	const [selectedUbications, setSelectedUbications] = useState<UbicationEntry[]>([]);

	// New Batch State
	const [openNewBatchDialog, setOpenNewBatchDialog] = useState(false);
	const [newBatchData, setNewBatchData] = useState({
		batch: '',
		expiry_date: ''
	});

	// UI States
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		loadInitialData();
	}, []);

	useEffect(() => {
		if (selectedProduct) {
			loadBatches(selectedProduct.product_id);
		} else {
			setBatches([]);
			setSelectedBatch(null);
		}
	}, [selectedProduct]);

	const loadInitialData = async () => {
		try {
			const [productsData, ubicationsData] = await Promise.all([
				productService.getAllProducts(),
				ubicationService.getAllUbications()
			]);
			setProducts(productsData);
			setUbications(ubicationsData);
		} catch (err) {
			console.error("Error loading initial data", err);
			setError("Error al cargar datos iniciales");
		}
	};

	const loadBatches = async (productId: number) => {
		try {
			const data = await batchService.getBatchesByProductId(productId);
			setBatches(data);
		} catch (err) {
			console.error("Error loading batches", err);
		}
	};

	const handleCreateBatch = async () => {
		if (!selectedProduct) return;
		try {
			const newBatch = await batchService.createBatch({
				product_id: selectedProduct.product_id,
				batch: newBatchData.batch,
				expiry_date: newBatchData.expiry_date
			});
			setBatches([...batches, newBatch]);
			setSelectedBatch(newBatch);
			setOpenNewBatchDialog(false);
			setNewBatchData({ batch: '', expiry_date: '' });
		} catch (err) {
			console.error("Error creating batch", err);
			alert("Error al crear el lote");
		}
	};

	const handleAddUbication = (ubication: Ubication | null) => {
		if (ubication && !selectedUbications.find(u => u.ubication.ubication_id === ubication.ubication_id)) {
			setSelectedUbications([...selectedUbications, { ubication, amount: 0 }]);
		}
	};

	const handleAmountChange = (index: number, amount: string) => {
		const newUbications = [...selectedUbications];
		const parsedAmount = parseInt(amount) || 0;
		newUbications[index].amount = parsedAmount;

		// If changing the first row, update all other rows to match
		if (index === 0) {
			for (let i = 1; i < newUbications.length; i++) {
				newUbications[i].amount = parsedAmount;
			}
		}

		setSelectedUbications(newUbications);
	};

	const handleRemoveUbication = (index: number) => {
		const newUbications = [...selectedUbications];
		newUbications.splice(index, 1);
		setSelectedUbications(newUbications);
	};

	const handleSaveEntry = async () => {
		if (!selectedProduct || !selectedBatch || selectedUbications.length === 0) {
			setError("Por favor complete todos los campos requeridos");
			return;
		}

		setLoading(true);
		setError('');
		setSuccess('');

		try {
			// Process each ubication entry
			for (const entry of selectedUbications) {
				if (entry.amount > 0) {
					await productUbicationService.receiveNewProduct({
						product_id: selectedProduct.product_id,
						batch_id: selectedBatch.batch_id,
						ubication_id: entry.ubication.ubication_id,
						amount: entry.amount
					});
				}
			}

			setSuccess("Entrada de mercancía registrada correctamente");
			// Reset form partially
			setSelectedUbications([]);
			setSelectedBatch(null);
			setSelectedProduct(null);
		} catch (err) {
			console.error("Error processing entry", err);
			setError("Error al procesar la entrada");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card sx={{ mb: 4, bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
			<CardContent>
				<Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<AddIcon color="primary" /> Entrada de Artículos
				</Typography>

				<Grid container spacing={3}>
					{/* Product Selection */}
					<Grid item xs={12} md={6}>
						<Autocomplete
							options={products}
							getOptionLabel={(option) => `${option.reference} - ${option.description}`}
							value={selectedProduct}
							onChange={(_, newValue) => setSelectedProduct(newValue)}
							renderInput={(params) => (
								<TextField {...params} label="Buscar Producto (Ref o Descripción)" fullWidth />
							)}
						/>
					</Grid>

					{/* Batch Selection */}
					<Grid item xs={12} md={6} sx={{ display: 'flex', gap: 1 }}>
						<Autocomplete
							options={batches}
							getOptionLabel={(option) => option.batch}
							value={selectedBatch}
							onChange={(_, newValue) => setSelectedBatch(newValue)}
							fullWidth
							disabled={!selectedProduct}
							renderInput={(params) => (
								<TextField {...params} label="Seleccionar Lote" />
							)}
							noOptionsText="No hay lotes. Cree uno nuevo."
						/>
						<Button
							variant="contained"
							onClick={() => setOpenNewBatchDialog(true)}
							disabled={!selectedProduct}
							sx={{ whiteSpace: 'nowrap' }}
						>
							Nuevo Lote
						</Button>
					</Grid>

					{/* Ubication Selection */}
					<Grid item xs={12}>
						<Divider sx={{ my: 1 }}>Ubicaciones de Destino</Divider>
						<Box sx={{ mb: 2 }}>
							<Autocomplete
								options={ubications.filter(u => !selectedUbications.find(su => su.ubication.ubication_id === u.ubication_id))}
								getOptionLabel={(option) => `${option.hallway}-${option.position}-${option.height}-${option.depth}`}
								onChange={(_, newValue) => handleAddUbication(newValue)}
								renderInput={(params) => (
									<TextField {...params} label="Añadir Ubicación" placeholder="Busque por coordenadas..." />
								)}
							/>
						</Box>

						{selectedUbications.length > 0 && (
							<TableContainer component={Paper} sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Ubicación</TableCell>
											<TableCell width={200}>Cantidad</TableCell>
											<TableCell width={50} align="right"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{selectedUbications.map((entry, index) => (
											<TableRow key={entry.ubication.ubication_id}>
												<TableCell>
													{`${entry.ubication.hallway}-${entry.ubication.position}-${entry.ubication.height}-${entry.ubication.depth}`}
												</TableCell>
												<TableCell>
													<TextField
														type="number"
														size="small"
														value={entry.amount}
														onChange={(e) => handleAmountChange(index, e.target.value)}
														fullWidth
													/>
												</TableCell>
												<TableCell align="right">
													<IconButton onClick={() => handleRemoveUbication(index)} size="small" color="error">
														<DeleteIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Grid>
					<Grid item xs={12}>
						{error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
						{success && <Typography color="success.main" sx={{ mb: 1 }}>{success}</Typography>}
						<Button
							variant="contained"
							color="primary"
							startIcon={<SaveIcon />}
							onClick={handleSaveEntry}
							disabled={loading || !selectedProduct || !selectedBatch || selectedUbications.length === 0}
							fullWidth
						>
							{loading ? 'Procesando...' : 'Registrar Entrada'}
						</Button>
					</Grid>
				</Grid>
			</CardContent>

			{/* New Batch Dialog */}
			<Dialog open={openNewBatchDialog} onClose={() => setOpenNewBatchDialog(false)}>
				<DialogTitle>Crear Nuevo Lote</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 1 }}>
					<TextField
						label="Número de Lote"
						fullWidth
						value={newBatchData.batch}
						onChange={(e) => setNewBatchData({ ...newBatchData, batch: e.target.value })}
					/>
					<TextField
						label="Fecha de Caducidad"
						type="date"
						fullWidth
						InputLabelProps={{ shrink: true }}
						value={newBatchData.expiry_date}
						onChange={(e) => setNewBatchData({ ...newBatchData, expiry_date: e.target.value })}
					/>
					<Typography variant="caption">Producto: {selectedProduct?.reference}</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenNewBatchDialog(false)}>Cancelar</Button>
					<Button onClick={handleCreateBatch} variant="contained">Crear</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default ProductEntryCard;

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
	Tabs,
	Tab,
	List,
	ListItem,
	ListItemText
} from '@mui/material';
import {
	RemoveCircle as RemoveIcon,
	DeleteSweep as EmptyIcon,
	ArrowForward as ArrowIcon
} from '@mui/icons-material';
import productService, { Product } from '../../services/productService';
import ubicationService, { Ubication } from '../../services/ubicationService';
import productUbicationService, { ProductUbication } from '../../services/productUbicationService';

const ProductDispatchCard: React.FC = () => {
	const [tabValue, setTabValue] = useState(0);

	// Data States
	const [products, setProducts] = useState<Product[]>([]);
	const [ubications, setUbications] = useState<Ubication[]>([]);

	// Selection States (Dispatch)
	const [selectedUbication, setSelectedUbication] = useState<Ubication | null>(null);
	const [ubicationContents, setUbicationContents] = useState<ProductUbication[]>([]);
	const [selectedProductUbication, setSelectedProductUbication] = useState<ProductUbication | null>(null);
	const [dispatchAmount, setDispatchAmount] = useState<string>('');

	// Load Initial Data
	useEffect(() => {
		loadInitialData();
	}, []);

	// Load Ubication Content when selected
	useEffect(() => {
		if (selectedUbication) {
			loadUbicationContent(selectedUbication.ubication_id);
		} else {
			setUbicationContents([]);
			setSelectedProductUbication(null);
		}
	}, [selectedUbication]);

	const loadInitialData = async () => {
		try {
			const [productsData, ubicationsData] = await Promise.all([
				productService.getAllProducts(),
				ubicationService.getAllUbications()
			]);
			setProducts(productsData);
			setUbications(ubicationsData);
		} catch (err) {
			console.error("Error loading data", err);
		}
	};

	const loadUbicationContent = async (ubicationId: number) => {
		try {
			const data = await productUbicationService.getProductUbicationByUbicationId(ubicationId);
			setUbicationContents(data);
		} catch (err) {
			console.error("Error loading ubication content", err);
		}
	};

	// --- Handlers for Empty Ubication ---
	const [openConfirmEmpty, setOpenConfirmEmpty] = useState(false);

	const handleEmptyUbication = async () => {
		if (!selectedUbication) return;
		try {
			await productUbicationService.emptyUbication(selectedUbication.ubication_id);
			setOpenConfirmEmpty(false);
			setSelectedUbication(null);
			setUbicationContents([]);
			alert("Ubicación vaciada correctamente.");
		} catch (err) {
			console.error("Error emptying ubication", err);
			alert("Error al vaciar la ubicación.");
		}
	};

	// --- Handlers for Dispatch Product ---
	const handleDispatchProduct = async () => {
		if (!selectedProductUbication || !dispatchAmount) return;

		const amount = parseInt(dispatchAmount);
		if (isNaN(amount) || amount <= 0 || amount > selectedProductUbication.amount) {
			alert("Cantidad inválida.");
			return;
		}

		try {
			await productUbicationService.dispatchProduct({
				ubication_id: selectedProductUbication.ubication_id,
				product_id: selectedProductUbication.product_id,
				batch_id: selectedProductUbication.batch_id,
				amount: amount
			});
			alert("Producto retirado correctamente.");
			setDispatchAmount('');
			setSelectedProductUbication(null);
			if (selectedUbication) loadUbicationContent(selectedUbication.ubication_id);
		} catch (err) {
			console.error("Error dispatching product", err);
			alert("Error al retirar el producto.");
		}
	};

	return (
		<Card sx={{ mb: 4, bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
			<CardContent>
				<Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<RemoveIcon color="error" /> Salida de Artículos
				</Typography>

				<Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
					<Tab label="Retirar Producto" />
					<Tab label="Vaciar Ubicación" />
				</Tabs>

				{/* TAB 0: Retirar Producto */}
				{tabValue === 0 && (
					<Grid container spacing={3}>
						<Grid item xs={12} md={4}>
							<Autocomplete
								options={ubications}
								getOptionLabel={(option) => `${option.hallway}-${option.position}-${option.height}-${option.depth}`}
								value={selectedUbication}
								onChange={(_, newValue) => setSelectedUbication(newValue)}
								renderInput={(params) => (
									<TextField {...params} label="Seleccionar Ubicación" />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Autocomplete
								options={ubicationContents}
								getOptionLabel={(option) => {
									const prod = products.find(p => p.product_id === option.product_id);
									return prod ? `${prod.reference} (Lote: ${option.batchEntity?.batch}) - Disp: ${option.amount}` : `ID: ${option.product_id}`;
								}}
								value={selectedProductUbication}
								onChange={(_, newValue) => setSelectedProductUbication(newValue)}
								disabled={!selectedUbication}
								renderInput={(params) => (
									<TextField {...params} label="Seleccionar Producto" helperText={!selectedUbication ? "Seleccione ubicación primero" : ""} />
								)}
								noOptionsText="Ubicación vacía"
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<TextField
								label="Cantidad"
								type="number"
								fullWidth
								value={dispatchAmount}
								onChange={(e) => setDispatchAmount(e.target.value)}
								disabled={!selectedProductUbication}
							/>
						</Grid>
						<Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
							<Button
								variant="contained"
								color="error"
								fullWidth
								onClick={handleDispatchProduct}
								disabled={!selectedProductUbication || !dispatchAmount}
							>
								Retirar
							</Button>
						</Grid>
					</Grid>
				)}

				{/* TAB 1: Vaciar Ubicación */}
				{tabValue === 1 && (
					<Grid container spacing={3} alignItems="center">
						<Grid item xs={12} md={6}>
							<Autocomplete
								options={ubications}
								getOptionLabel={(option) => `${option.hallway}-${option.position}-${option.height}-${option.depth}`}
								value={selectedUbication}
								onChange={(_, newValue) => setSelectedUbication(newValue)}
								renderInput={(params) => (
									<TextField {...params} label="Seleccionar Ubicación a Vaciar" />
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Button
								variant="contained"
								color="error"
								startIcon={<EmptyIcon />}
								onClick={() => setOpenConfirmEmpty(true)}
								disabled={!selectedUbication || ubicationContents.length === 0}
							>
								Vaciar Completamente
							</Button>
							{selectedUbication && ubicationContents.length === 0 && (
								<Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
									La ubicación ya está vacía.
								</Typography>
							)}
						</Grid>
					</Grid>
				)}
			</CardContent>

			{/* Confirm Empty Dialog */}
			<Dialog open={openConfirmEmpty} onClose={() => setOpenConfirmEmpty(false)}>
				<DialogTitle>Confirmar Vaciado</DialogTitle>
				<DialogContent>
					<Typography gutterBottom>
						¿Está seguro de que desea vaciar la ubicación
						<b> {selectedUbication ? `${selectedUbication.hallway}-${selectedUbication.position}-${selectedUbication.height}-${selectedUbication.depth}` : ''}</b>?
					</Typography>
					<Typography variant="subtitle2" sx={{ mt: 2 }}>Contenido actual:</Typography>
					<List dense>
						{ubicationContents.map((item) => (
							<ListItem key={item.product_ubication_id}>
								<ListItemText
									primary={products.find(p => p.product_id === item.product_id)?.reference || `ID: ${item.product_id}`}
									secondary={`Lote: ${item.batchEntity?.batch || item.batch_id} - Cant: ${item.amount}`}
								/>
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirmEmpty(false)}>Cancelar</Button>
					<Button onClick={handleEmptyUbication} variant="contained" color="error">Confirmar y Vaciar</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default ProductDispatchCard;

import React, { useEffect, useState, useMemo } from 'react';
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
	Button,
	TextField,
	InputAdornment,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControlLabel,
	Checkbox,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Search as SearchIcon,
	Add as AddIcon,
	Delete as DeleteIcon,
	MoreVert as MoreVertIcon,
	Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import productService, { Product } from '../../services/productService';

const ProductsPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	// Menu State
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuProduct, setMenuProduct] = useState<Product | null>(null);

	// Modal State
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
	const [formData, setFormData] = useState({
		product_id: 0,
		reference: '',
		description: '',
		company: 1,
		obsolete: false
	});

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		try {
			setLoading(true);
			const data = await productService.getAllProducts();
			setProducts(data);
		} catch (err) {
			setError('Error al cargar los productos');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, product: Product) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
		setMenuProduct(product);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setMenuProduct(null);
	};

	const handleOpenCreate = () => {
		setDialogMode('create');
		setFormData({ product_id: 0, reference: '', description: '', company: 1, obsolete: false });
		setOpenDialog(true);
	};

	const handleOpenEdit = () => {
		if (menuProduct) {
			setDialogMode('edit');
			setFormData({
				product_id: menuProduct.product_id,
				reference: menuProduct.reference,
				description: menuProduct.description,
				company: menuProduct.company,
				obsolete: menuProduct.obsolete
			});
			setOpenDialog(true);
			handleCloseMenu();
		}
	};

	const handleSaveProduct = async () => {
		if (!formData.reference || !formData.description) {
			alert('Referencia y Descripción son obligatorios');
			return;
		}
		try {
			if (dialogMode === 'create') {
				await productService.createProduct({
					reference: formData.reference,
					description: formData.description,
					company: formData.company,
					obsolete: formData.obsolete
				});
			} else {
				await productService.updateProduct({
					product_id: formData.product_id,
					reference: formData.reference,
					description: formData.description,
					company: formData.company,
					obsolete: formData.obsolete
				});
			}
			setOpenDialog(false);
			loadProducts();
		} catch (err) {
			console.error('Error saving product', err);
			alert('Error al guardar el producto');
		}
	};

	const handleDeleteProduct = async () => {
		if (menuProduct && window.confirm(`¿Está seguro de eliminar el producto ${menuProduct.reference}?`)) {
			try {
				await productService.deleteProduct(menuProduct.product_id);
				loadProducts();
			} catch (err) {
				console.error('Error deleting product', err);
				alert('Error al eliminar producto: Verifique que no tenga stock o lotes asociados.');
			}
		}
		handleCloseMenu();
	};

	const filteredProducts = useMemo(() => {
		const term = searchTerm.toLowerCase();
		const filtered = products.filter(p =>
			p.reference.toLowerCase().includes(term) ||
			p.description.toLowerCase().includes(term)
		);
		return filtered.sort((a, b) => a.reference.localeCompare(b.reference));
	}, [products, searchTerm]);

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			<Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate('/')}
					variant="outlined"
					sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
				>
					Volver
				</Button>
				<Typography variant="h4" fontWeight={600} sx={{ flexGrow: 1 }}>
					Listado de Productos
				</Typography>

				<TextField
					placeholder="Buscar por referencia o descripción..."
					variant="outlined"
					size="small"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{
						minWidth: 300,
						bgcolor: 'rgba(255, 255, 255, 0.05)',
						borderRadius: 1,
						'& .MuiOutlinedInput-root': {
							color: 'white',
							'& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
							'&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
						},
						'& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
							</InputAdornment>
						),
					}}
				/>

				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={handleOpenCreate}
				>
					Nuevo Producto
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
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Referencia</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Descripción</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Company</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Estado</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }} align="right">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredProducts.map((row) => (
							<TableRow
								key={row.product_id}
								hover
								onClick={() => navigate(`/products/${row.product_id}`)}
								sx={{ cursor: 'pointer' }}
							>
								<TableCell>{row.product_id}</TableCell>
								<TableCell sx={{ fontWeight: 'bold', color: 'secondary.main' }}>{row.reference}</TableCell>
								<TableCell>{row.description}</TableCell>
								<TableCell>{row.company}</TableCell>
								<TableCell>
									<Box
										component="span"
										sx={{
											px: 1,
											py: 0.5,
											borderRadius: 1,
											fontSize: '0.875rem',
											bgcolor: row.obsolete ? 'error.main' : 'success.main',
											color: 'white'
										}}
									>
										{row.obsolete ? 'Obsoleto' : 'Activo'}
									</Box>
								</TableCell>
								<TableCell align="right">
									<IconButton
										onClick={(e) => handleOpenMenu(e, row)}
										sx={{ color: 'white' }}
									>
										<MoreVertIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{filteredProducts.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									{searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Action Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
			>
				<MenuItem onClick={handleOpenEdit}>
					<ListItemIcon>
						<EditIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Modificar</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleDeleteProduct}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" color="error" />
					</ListItemIcon>
					<ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
				</MenuItem>
			</Menu>

			{/* Create/Edit Product Dialog */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>{dialogMode === 'create' ? 'Crear Nuevo Producto' : 'Modificar Producto'}</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400, mt: 1 }}>
					<TextField
						label="Referencia"
						fullWidth
						value={formData.reference}
						onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
					/>
					<TextField
						label="Descripción"
						fullWidth
						multiline
						rows={3}
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					/>
					<TextField
						label="Company ID"
						type="number"
						fullWidth
						value={formData.company}
						onChange={(e) => setFormData({ ...formData, company: parseInt(e.target.value) || 0 })}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={formData.obsolete}
								onChange={(e) => setFormData({ ...formData, obsolete: e.target.checked })}
							/>
						}
						label="Obsoleto"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
					<Button onClick={handleSaveProduct} variant="contained">Guardar</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ProductsPage;

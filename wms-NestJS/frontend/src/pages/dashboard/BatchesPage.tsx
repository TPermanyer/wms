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
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Search as SearchIcon,
	Add as AddIcon,
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import batchService, { Batch } from '../../services/batchService';

const BatchesPage: React.FC = () => {
	const [batches, setBatches] = useState<Batch[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	// Menu State
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuBatch, setMenuBatch] = useState<Batch | null>(null);

	// Modal State
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
	const [formData, setFormData] = useState({
		batch_id: 0,
		batch: '',
		expiry_date: '',
		product_id: 0
	});

	useEffect(() => {
		loadBatches();
	}, []);

	const loadBatches = async () => {
		try {
			const data = await batchService.getAllBatches();
			setBatches(data);
		} catch (err) {
			setError('Error al cargar los lotes');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, batch: Batch) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
		setMenuBatch(batch);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setMenuBatch(null);
	};

	const handleOpenCreate = () => {
		setDialogMode('create');
		setFormData({ batch_id: 0, batch: '', expiry_date: '', product_id: 0 });
		setOpenDialog(true);
	};

	const handleOpenEdit = () => {
		if (menuBatch) {
			// Format date for input type="date"
			let dateStr = '';
			if (menuBatch.expiry_date) {
				const date = new Date(menuBatch.expiry_date);
				dateStr = date.toISOString().split('T')[0];
			}

			setDialogMode('edit');
			setFormData({
				batch_id: menuBatch.batch_id,
				batch: menuBatch.batch,
				expiry_date: dateStr,
				product_id: menuBatch.product_id || 0
			});
			setOpenDialog(true);
			handleCloseMenu();
		}
	};

	const handleSaveBatch = async () => {
		try {
			if (dialogMode === 'create') {
				await batchService.createBatch({
					batch: formData.batch,
					product_id: formData.product_id,
					expiry_date: formData.expiry_date
				});
			} else {
				await batchService.updateBatch({
					batch_id: formData.batch_id,
					batch: formData.batch,
					product_id: formData.product_id,
					expiry_date: formData.expiry_date
				});
			}
			setOpenDialog(false);
			loadBatches();
		} catch (err) {
			console.error('Error saving batch', err);
			alert('Error al guardar el lote');
		}
	};

	const handleDeleteBatch = async () => {
		if (menuBatch && window.confirm(`¿Está seguro de eliminar el lote ${menuBatch.batch}?`)) {
			try {
				await batchService.deleteBatch(menuBatch.batch_id);
				loadBatches();
			} catch (err) {
				console.error('Error deleting batch', err);
				alert('Error al eliminar lote: Verifique que no tenga stock asociado.');
			}
		}
		handleCloseMenu();
	};

	const filteredBatches = useMemo(() => {
		const term = searchTerm.toLowerCase();
		const filtered = batches.filter(b =>
			b.batch.toLowerCase().includes(term)
		);
		return filtered.sort((a, b) => a.batch.localeCompare(b.batch));
	}, [batches, searchTerm]);

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
					Listado de Lotes
				</Typography>

				<TextField
					placeholder="Buscar por número de lote..."
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
					Nuevo Lote
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
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Lote</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Vencimiento</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Producto ID</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }} align="right">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredBatches.map((row) => (
							<TableRow
								key={row.batch_id}
								hover
								onClick={() => navigate(`/batches/${row.batch_id}`)}
								sx={{ cursor: 'pointer' }}
							>
								<TableCell>{row.batch_id}</TableCell>
								<TableCell sx={{ fontWeight: 'bold', color: 'secondary.main' }}>{row.batch}</TableCell>
								<TableCell>
									{row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : '-'}
								</TableCell>
								<TableCell>{row.product_id || '-'}</TableCell>
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
						{filteredBatches.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align="center">
									{searchTerm ? 'No se encontraron lotes' : 'No hay lotes registrados'}
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
				<MenuItem onClick={handleDeleteBatch}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" color="error" />
					</ListItemIcon>
					<ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
				</MenuItem>
			</Menu>

			{/* Create/Edit Modal */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>{dialogMode === 'create' ? 'Nuevo Lote' : 'Modificar Lote'}</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400, mt: 1 }}>
					<TextField
						label="Número de Lote"
						fullWidth
						value={formData.batch}
						onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
					/>
					<TextField
						label="Fecha de Vencimiento"
						type="date"
						fullWidth
						InputLabelProps={{ shrink: true }}
						value={formData.expiry_date}
						onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
					/>
					<TextField
						label="ID de Producto"
						type="number"
						fullWidth
						value={formData.product_id}
						onChange={(e) => setFormData({ ...formData, product_id: parseInt(e.target.value) || 0 })}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
					<Button onClick={handleSaveBatch} variant="contained">Guardar</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default BatchesPage;

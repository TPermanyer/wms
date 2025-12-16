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
	Button,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Add as AddIcon,
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ubicationService, { Ubication } from '../../services/ubicationService';

const UbicationsPage: React.FC = () => {
	const [ubications, setUbications] = useState<Ubication[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Menu State
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuUbication, setMenuUbication] = useState<Ubication | null>(null);

	// Modal State
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
	const [formData, setFormData] = useState({
		ubication_id: 0,
		hallway: '',
		position: 0,
		height: 0,
		depth: 0
	});

	// Filter state
	const [searchQuery, setSearchQuery] = useState('');
	const [filterMultiItem, setFilterMultiItem] = useState(false);

	const filteredUbications = ubications.filter((ubication) => {
		const coordinate = `${ubication.hallway}-${ubication.position}-${ubication.height}-${ubication.depth}`;
		const matchesSearch = coordinate.toLowerCase().includes(searchQuery.toLowerCase());

		if (!matchesSearch) return false;

		if (filterMultiItem) {
			const distinctProducts = new Set(ubication.productUbicationList?.map((p) => p.product_id)).size;
			return distinctProducts >= 2;
		}

		return true;
	});

	useEffect(() => {
		loadUbications();
	}, []);

	const loadUbications = async () => {
		try {
			const data = await ubicationService.getAllUbications();
			setUbications(data);
		} catch (err) {
			setError('Error al cargar las ubicaciones');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, ubication: Ubication) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
		setMenuUbication(ubication);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setMenuUbication(null);
	};

	const handleOpenCreate = () => {
		setDialogMode('create');
		setFormData({ ubication_id: 0, hallway: '', position: 0, height: 0, depth: 0 });
		setOpenDialog(true);
	};

	const handleOpenEdit = () => {
		if (menuUbication) {
			setDialogMode('edit');
			setFormData({
				ubication_id: menuUbication.ubication_id,
				hallway: menuUbication.hallway || '',
				position: menuUbication.position || 0,
				height: menuUbication.height || 0,
				depth: menuUbication.depth || 0
			});
			setOpenDialog(true);
			handleCloseMenu();
		}
	};

	const handleSaveUbication = async () => {
		try {
			if (dialogMode === 'create') {
				await ubicationService.createUbication({
					hallway: formData.hallway,
					position: formData.position,
					height: formData.height,
					depth: formData.depth
				});
			} else {
				await ubicationService.updateUbication({
					ubication_id: formData.ubication_id,
					hallway: formData.hallway,
					position: formData.position,
					height: formData.height,
					depth: formData.depth
				});
			}
			setOpenDialog(false);
			loadUbications();
		} catch (err) {
			console.error('Error saving ubication', err);
			alert('Error al guardar la ubicación');
		}
	};

	const handleDeleteUbication = async () => {
		if (menuUbication && window.confirm(`¿Está seguro de eliminar la ubicación ${menuUbication.hallway}-${menuUbication.position}-${menuUbication.height}-${menuUbication.depth}?`)) {
			try {
				await ubicationService.deleteUbication(menuUbication.ubication_id);
				loadUbications();
			} catch (err) {
				console.error('Error deleting ubication', err);
				alert('Error al eliminar ubicación: Verifique que no contenga productos.');
			}
		}
		handleCloseMenu();
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
				<Typography variant="h4" fontWeight={600} sx={{ flexGrow: 1 }}>
					Lista de Ubicaciones
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					startIcon={<SwapHorizIcon />}
					onClick={() => navigate('/move-products')}
					sx={{ mr: 2 }}
				>
					Mover Productos
				</Button>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={handleOpenCreate}
				>
					Nueva Ubicación
				</Button>
			</Box>

			<Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
				<TextField
					placeholder="Buscar por coordenadas (Ej: A-1-1-1)"
					variant="outlined"
					size="small"
					fullWidth
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 1 }}
				/>
				<Button
					variant={filterMultiItem ? "contained" : "outlined"}
					color={filterMultiItem ? "secondary" : "inherit"}
					onClick={() => setFilterMultiItem(!filterMultiItem)}
					sx={{ whiteSpace: 'nowrap', borderColor: 'rgba(255,255,255,0.3)', color: filterMultiItem ? 'white' : 'text.secondary' }}
				>
					{filterMultiItem ? "Filtro Activo (+2 Prod.)" : "Filtrar +2 Productos"}
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
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Coordenadas</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Pasillo</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Posición</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Altura</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Profundidad</TableCell>
							<TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }} align="right">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUbications.map((row) => (
							<TableRow
								key={row.ubication_id}
								hover
								onClick={() => navigate(`/ubications/${row.ubication_id}`)}
								sx={{ cursor: 'pointer' }}
							>
								<TableCell>{row.ubication_id}</TableCell>
								<TableCell sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
									{`${row.hallway}-${row.position}-${row.height}-${row.depth}`}
								</TableCell>
								<TableCell>{row.hallway ?? '-'}</TableCell>
								<TableCell>{row.position ?? '-'}</TableCell>
								<TableCell>{row.height ?? '-'}</TableCell>
								<TableCell>{row.depth ?? '-'}</TableCell>
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
						{filteredUbications.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No hay ubicaciones registradas
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
				<MenuItem onClick={handleDeleteUbication}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" color="error" />
					</ListItemIcon>
					<ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
				</MenuItem>
			</Menu>

			{/* Create/Edit Modal */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>{dialogMode === 'create' ? 'Nueva Ubicación' : 'Modificar Ubicación'}</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400, mt: 1 }}>
					<TextField
						label="Pasillo (Hallway)"
						fullWidth
						value={formData.hallway}
						onChange={(e) => setFormData({ ...formData, hallway: e.target.value })}
					/>
					<TextField
						label="Posición"
						type="number"
						fullWidth
						value={formData.position}
						onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
					/>
					<TextField
						label="Altura"
						type="number"
						fullWidth
						value={formData.height}
						onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
					/>
					<TextField
						label="Profundidad"
						type="number"
						fullWidth
						value={formData.depth}
						onChange={(e) => setFormData({ ...formData, depth: parseInt(e.target.value) || 0 })}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
					<Button onClick={handleSaveUbication} variant="contained">Guardar</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default UbicationsPage;

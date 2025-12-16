import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper
} from '@mui/material';
import {
	Inventory as InventoryIcon,
	LocationOn as LocationIcon,
	SwapHoriz as MovementIcon,
	Layers as BatchIcon,
	Percent as PercentIcon,
	EventBusy as EventBusyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ubicationService from '../../services/ubicationService';
import movementService from '../../services/movementService';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import statisticsService from '../../services/statisticsService';
import { ProductUbication } from '../../services/productUbicationService';
import ProductEntryCard from '../../components/dashboard/ProductEntryCard';
import ProductDispatchCard from '../../components/dashboard/ProductDispatchCard';

interface StatCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	color: string;
	onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onClick }) => (
	<Card
		onClick={onClick}
		sx={{
			cursor: onClick ? 'pointer' : 'default',
			transition: 'transform 0.2s',
			'&:hover': onClick ? { transform: 'translateY(-4px)' } : {}
		}}
	>
		<CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
			<Box
				sx={{
					p: 1.5,
					borderRadius: 2,
					backgroundColor: `${color}20`,
					color: color,
					display: 'flex',
				}}
			>
				{icon}
			</Box>
			<Box>
				<Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
					{title}
				</Typography>
				<Typography variant="h5" fontWeight={600}>
					{value}
				</Typography>
			</Box>
		</CardContent>
	</Card>
);

const DashboardPage: React.FC = () => {
	const navigate = useNavigate();
	const [ubicationCount, setUbicationCount] = React.useState<string>('--');
	const [movementCount, setMovementCount] = React.useState<string>('--');
	const [productCount, setProductCount] = React.useState<string>('--');
	const [batchCount, setBatchCount] = React.useState<string>('--');
	const [expiringProducts, setExpiringProducts] = React.useState<ProductUbication[]>([]);

	React.useEffect(() => {
		const fetchStats = async () => {
			try {
				const [ubications, movements, products, batches, expiring] = await Promise.all([
					ubicationService.getAllUbications(),
					movementService.getAllMovementLogs(),
					productService.getAllProducts(),
					batchService.getAllBatches(),
					statisticsService.getExpiringProducts()
				]);
				setUbicationCount(ubications.length.toString());
				setMovementCount(movements.length.toString());
				setProductCount(products.length.toString());
				setBatchCount(batches.length.toString());
				setExpiringProducts(expiring);
			} catch (error) {
				console.error("Error fetching dashboard stats", error);
			}
		};
		fetchStats();
	}, []);

	return (
		<Box>
			<Typography variant="h4" fontWeight={600} gutterBottom>
				Bienvenido al WMS de Farmedco
			</Typography>
			<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
				Gestione el inventario, ubicaciones y movimientos de productos de su almacén.
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Productos"
						value={productCount}
						icon={<InventoryIcon />}
						color="#6366f1"
						onClick={() => navigate('/products')}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Lotes"
						value={batchCount}
						icon={<BatchIcon />}
						color="#f59e0b"
						onClick={() => navigate('/batches')}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Ubicaciones"
						value={ubicationCount}
						icon={<LocationIcon />}
						color="#8b5cf6"
						onClick={() => navigate('/ubications')}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Movimientos"
						value={movementCount}
						icon={<MovementIcon />}
						color="#10b981"
						onClick={() => navigate('/movements')}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Estadísticas"
						value="Ver"
						icon={<PercentIcon />}
						color="#ec4899"
						onClick={() => navigate('/statistics')}
					/>
				</Grid>
			</Grid>

			<ProductEntryCard />
			<ProductDispatchCard />

			{expiringProducts.length > 0 && (
				<Card sx={{ mb: 4, bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
					<CardContent>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'warning.main' }}>
							<EventBusyIcon sx={{ mr: 1 }} />
							<Typography variant="h6" fontWeight={600}>
								Productos Próximos a Caducar (6 Meses) o Caducados
							</Typography>
						</Box>
						<TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Ubicación</TableCell>
										<TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Referencia</TableCell>
										<TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Descripción</TableCell>
										<TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Lote</TableCell>
										<TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Fecha Caducidad</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{expiringProducts.map((item) => (
										<TableRow key={item.product_ubication_id}>
											<TableCell sx={{ color: 'white' }}>
												{item.ubicationEntity ? `${item.ubicationEntity.hallway}-${item.ubicationEntity.position}-${item.ubicationEntity.height}-${item.ubicationEntity.depth}` : '-'}
											</TableCell>
											<TableCell sx={{ color: 'white' }}>{item.productEntity?.reference}</TableCell>
											<TableCell sx={{ color: 'white' }}>{item.productEntity?.description}</TableCell>
											<TableCell sx={{ color: 'white' }}>{item.batchEntity?.batch}</TableCell>
											<TableCell sx={{
												color: item.batchEntity?.expiry_date && new Date(item.batchEntity.expiry_date) < new Date() ? 'error.main' : 'warning.light',
												fontWeight: 'bold'
											}}>
												{item.batchEntity?.expiry_date ? new Date(item.batchEntity.expiry_date).toLocaleDateString() : '-'}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</CardContent>
				</Card>
			)}


		</Box>
	);
};

export default DashboardPage;

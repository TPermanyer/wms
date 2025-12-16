import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MovementLogsPage from './pages/dashboard/MovementLogsPage';
import UbicationsPage from './pages/dashboard/UbicationsPage';
import UbicationDetailsPage from './pages/dashboard/UbicationDetailsPage';
import ProductsPage from './pages/dashboard/ProductsPage';
import ProductStockPage from './pages/dashboard/ProductStockPage';
import BatchesPage from './pages/dashboard/BatchesPage';
import BatchStockPage from './pages/dashboard/BatchStockPage';
import MoveProductsPage from './pages/dashboard/MoveProductsPage';
import StatisticsPage from './pages/dashboard/StatisticsPage';
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	const isAuthenticated = authService.isAuthenticated();

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

// Public Route Component (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated = authService.isAuthenticated();

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

const App: React.FC = () => {
	return (
		<Routes>
			<Route
				path="/login"
				element={
					<PublicRoute>
						<AuthLayout>
							<LoginPage />
						</AuthLayout>
					</PublicRoute>
				}
			/>
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<MainLayout>
							<DashboardPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/movements"
				element={
					<ProtectedRoute>
						<MainLayout>
							<MovementLogsPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/ubications"
				element={
					<ProtectedRoute>
						<MainLayout>
							<UbicationsPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/ubications/:id"
				element={
					<ProtectedRoute>
						<MainLayout>
							<UbicationDetailsPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/products"
				element={
					<ProtectedRoute>
						<MainLayout>
							<ProductsPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/products/:id"
				element={
					<ProtectedRoute>
						<MainLayout>
							<ProductStockPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/batches"
				element={
					<ProtectedRoute>
						<MainLayout>
							<BatchesPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/batches/:id"
				element={
					<ProtectedRoute>
						<MainLayout>
							<BatchStockPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/statistics"
				element={
					<ProtectedRoute>
						<MainLayout>
							<StatisticsPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/move-products"
				element={
					<ProtectedRoute>
						<MainLayout>
							<MoveProductsPage />
						</MainLayout>
					</ProtectedRoute>
				}
			/>
			{/* Catch all redirect */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default App;

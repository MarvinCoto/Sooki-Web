import { Routes, Route } from 'react-router-dom';
import RegisterStoreScreen from './screens/RegisterStoreScreen';
import SetupCredentialsScreen from './screens/SetupCredentialsScreen';
import LoginScreen from './screens/LoginScreen';
import RecoveryScreen from './screens/RecoveryScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductsScreen from './screens/ProductsScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* Rutas publicas */}
            <Route path="/" element={<RegisterStoreScreen />} />
            <Route path="/setup-credentials" element={<SetupCredentialsScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/recovery" element={<RecoveryScreen />} />

            {/* Rutas protegidas — solo rol store */}
            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["store"]}>
                    <DashboardScreen />
                </ProtectedRoute>
            } />
            <Route path="/productos" element={
                <ProtectedRoute allowedRoles={["store"]}>
                    <ProductsScreen />
                </ProtectedRoute>
            } />
            <Route path="/categorias" element={
                <ProtectedRoute allowedRoles={["store"]}>
                    <CategoriesScreen />
                </ProtectedRoute>
            } />
            <Route path="/pedidos" element={
                <ProtectedRoute allowedRoles={["store"]}>
                    <div style={{ padding: "40px", fontFamily: "sans-serif", color: "#1B2B44" }}>
                        Pedidos — proximamente
                    </div>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;
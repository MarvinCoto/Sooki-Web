import { Routes, Route } from 'react-router-dom';
import RegisterStoreScreen from './screens/RegisterStoreScreen';
import SetupCredentialsScreen from './screens/SetupCredentialsScreen';
import LoginScreen from './screens/LoginScreen';
import RecoveryScreen from './screens/RecoveryScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* Rutas publicas */}
            <Route path="/" element={<RegisterStoreScreen />} />
            <Route path="/setup-credentials" element={<SetupCredentialsScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/recovery" element={<RecoveryScreen />} />

            {/* Rutas protegidas — solo rol shop */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["store"]}>
                        <div style={{ color: "white", padding: "40px", background: "#1B2B44", minHeight: "100vh" }}>
                            Dashboard — proximamente
                        </div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
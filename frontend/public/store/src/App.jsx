import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Stores from './pages/Stores';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import PasswordRecovery from './pages/PasswordRecovery';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';

// Contexts
import { LoginLimitProvider } from './context/LoginLimitContext';
import { RecoveryProvider } from './context/RecoveryContext';
import { AuthProvider } from './context/AuthContext';

// Routes
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import RecoveryRoute from './routes/RecoveryRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <LoginLimitProvider>
        <RecoveryProvider>
          <AuthProvider>
            <div className="app-wrapper">
              <Nav />
              <main className="app-main">
                <Routes>

                  {/* PROCESO DE RECUPERACIÓN DE CONTRASEÑA */}
                  <Route element={<RecoveryRoute />}>
                    <Route path="/verifycode" element={<VerifyCode />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                  </Route>

                  {/* RUTAS PÚBLICAS */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verifyemail" element={<VerifyEmail />} />
                    <Route path="/passwordrecovery" element={<PasswordRecovery />} />
                  </Route>

                  {/* RUTAS ACCESIBLES PARA TODOS */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/stores" element={<Stores />} />
                  <Route path="/aboutUs" element={<AboutUs />} />
                  <Route path="/contactUs" element={<ContactUs />} />

                  {/* RUTAS PRIVADAS */}
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/favorites" element={<Favorites />} />

                  {/* 404 */}
                  <Route path="*" element={<PageNotFound />} />

                </Routes>
              </main>
              <Footer />
            </div>

            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </AuthProvider>
        </RecoveryProvider>
      </LoginLimitProvider>
    </BrowserRouter>
  );
}

export default App;
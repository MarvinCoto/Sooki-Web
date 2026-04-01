import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, X, Eye, EyeOff, Camera, ShoppingBag, LogOut, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import useProfile from "../hooks/Profile/useProfile";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);
  const authContext = useAuth();
  const { updateProfile, changePassword, validateImage, createImagePreview, isUpdating, isLoadingProfile, loadUserProfile, getUserPhotoUrl } = useProfile();

  const { logOut, user, isLoading } = authContext;

  useEffect(() => {
    if (user?.id) loadUserProfile();
  }, []);

  const handleLogout = async () => {
    const success = await logOut();
    if (success) setTimeout(() => navigate("/"), 500);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) { toast.error(validation.error); return; }

    setIsUploadingImage(true);
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      const result = await updateProfile({}, file);
      if (result.success) {
        setImagePreview(null);
        setShowEditModal(false);
        await loadUserProfile();
      }
    } catch (error) {
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (result.success) {
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setImagePreview(null);
  };

  const photoUrl = getUserPhotoUrl();

  if (isLoadingProfile) {
    return (
      <div className="profile-loading">
        <Loader size={36} className="profile-spinner" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* ── SIDEBAR ── */}
        <aside className="profile-sidebar">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {photoUrl ? (
                <img src={photoUrl} alt="Perfil" className="profile-avatar-img"
                  onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <User size={52} color="#94a3b8" />
              )}
            </div>
            <button className="profile-avatar-edit" onClick={() => setShowEditModal(true)} title="Cambiar foto">
              <Camera size={14} />
            </button>
          </div>

          <h2 className="profile-name">{user?.name} {user?.lastname}</h2>
          <p className="profile-email">{user?.email}</p>

          {/* Nav tabs */}
          <nav className="profile-nav">
            <button className={`profile-nav-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
              <User size={18} /> Mi Perfil
            </button>
            <button className={`profile-nav-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              <ShoppingBag size={18} /> Mis Pedidos
            </button>
          </nav>

          <button className="profile-logout-btn" onClick={handleLogout} disabled={isLoading}>
            <LogOut size={17} />
            {isLoading ? "Cerrando..." : "Cerrar Sesión"}
          </button>
        </aside>

        {/* ── CONTENIDO ── */}
        <div className="profile-content">

          {/* TAB: Mi Perfil */}
          {activeTab === "profile" && (
            <div>
              <div className="profile-content-header">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu información personal y configuración de cuenta</p>
              </div>

              <div className="profile-info-grid">
                {/* Información personal */}
                <div className="profile-info-card">
                  <h3 className="profile-info-card-title">Información Personal</h3>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Nombre completo</span>
                    <span className="profile-info-value">{user?.name} {user?.lastname}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Correo electrónico</span>
                    <span className="profile-info-value">{user?.email}</span>
                  </div>
                  {user?.birthdate && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">Fecha de nacimiento</span>
                      <span className="profile-info-value">
                        {new Date(user.birthdate).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Configuración */}
                <div className="profile-info-card">
                  <h3 className="profile-info-card-title">Configuración</h3>
                  <button className="profile-action-btn primary" onClick={() => setShowEditModal(true)}>
                    <Camera size={17} /> Cambiar Foto de Perfil
                  </button>
                  <button className="profile-action-btn secondary" onClick={() => setShowPasswordModal(true)}>
                    <Lock size={17} /> Cambiar Contraseña
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Mis Pedidos */}
          {activeTab === "orders" && (
            <div>
              <div className="profile-content-header">
                <h1>Mis Pedidos</h1>
                <p>Revisa el historial de tus compras</p>
              </div>
              <div className="profile-empty-state">
                <ShoppingBag size={48} color="#cbd5e1" />
                <p>Aún no tienes pedidos realizados.</p>
                <button className="profile-action-btn primary" onClick={() => navigate("/products")}>
                  Explorar productos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input de archivo oculto */}
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />

      {/* MODAL: Cambiar foto */}
      {showEditModal && (
        <div className="profile-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>Cambiar Foto de Perfil</h3>
              <button onClick={closeModals} className="profile-modal-close"><X size={18} /></button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-photo-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="profile-photo-preview-img" />
                ) : photoUrl ? (
                  <img src={photoUrl} alt="Actual" className="profile-photo-preview-img" />
                ) : (
                  <div className="profile-photo-placeholder"><User size={60} color="#94a3b8" /></div>
                )}
              </div>
              <button
                className="profile-action-btn primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? <><Loader size={16} className="profile-spinner" /> Subiendo...</> : <><Camera size={16} /> Seleccionar Foto</>}
              </button>
              <p className="profile-upload-hint">JPG, PNG o WebP — máximo 5MB</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cambiar contraseña */}
      {showPasswordModal && (
        <div className="profile-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>Cambiar Contraseña</h3>
              <button onClick={closeModals} className="profile-modal-close"><X size={18} /></button>
            </div>
            <div className="profile-modal-body">
              {[
                { label: "Contraseña Actual", key: "currentPassword", show: showCurrentPass, toggle: () => setShowCurrentPass(!showCurrentPass) },
                { label: "Nueva Contraseña", key: "newPassword", show: showNewPass, toggle: () => setShowNewPass(!showNewPass) },
                { label: "Confirmar Nueva Contraseña", key: "confirmPassword", show: showConfirmPass, toggle: () => setShowConfirmPass(!showConfirmPass) },
              ].map(({ label, key, show, toggle }) => (
                <div key={key} className="profile-form-group">
                  <label className="profile-form-label">{label}</label>
                  <div className="profile-password-wrap">
                    <input
                      type={show ? "text" : "password"}
                      name={key}
                      value={passwordData[key]}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="profile-form-input"
                      placeholder="••••••••"
                    />
                    <button type="button" className="profile-password-toggle" onClick={toggle}>
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <button className="profile-action-btn primary" onClick={handleChangePassword} disabled={isUpdating}>
                {isUpdating ? <><Loader size={16} className="profile-spinner" /> Cambiando...</> : <><Lock size={16} /> Cambiar Contraseña</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
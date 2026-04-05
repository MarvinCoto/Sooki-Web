import { useRegisterStore } from "../hooks/RegisterStores/useRegisterStore";
import { useRegisterStoreForm } from "../hooks/RegisterStores/useRegisterStoreForm";
import RegisterForm from "../components/registerStore/RegisterForm";
import Step4VerifyEmail from "../components/registerStore/Step4VerifyEmail";
import PendingApprovalScreen from "../components/registerStore/PendingApprovalScreen";
import "../styles/registerStore.css";

const RegisterStoreScreen = () => {
    const {
        stage,
        loading,
        error,
        registeredEmail,
        formData,
        updateField,
        handleSubmit,
        handleVerifySuccess,
    } = useRegisterStore();

    const { errors, clearErrors, validateForm } = useRegisterStoreForm();

    const handleSend = () => {
        clearErrors();
        if (validateForm(formData)) handleSubmit();
    };

    if (stage === "pending") {
        return <PendingApprovalScreen />;
    }

    if (stage === "verify") {
        return (
            <div className="register-page">
                <div className="register-card">
                    <div className="register-header">
                        <h1>Verifica tu Correo</h1>
                        <p>Ingresa el codigo que enviamos a tu correo electronico</p>
                    </div>
                    <Step4VerifyEmail
                        email={registeredEmail}
                        onSuccess={handleVerifySuccess}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="register-card" style={{ maxWidth: "600px" }}>

                <div className="register-header">
                    <h1>Registro de Nueva Tienda</h1>
                    <p>Completa el siguiente formulario para solicitar tu tienda en Sooki</p>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <RegisterForm
                    data={formData}
                    errors={errors}
                    onChange={updateField}
                />

                <div style={{ marginTop: "28px" }}>
                    <button
                        className="btn-primary"
                        onClick={handleSend}
                        disabled={loading}
                        style={{ width: "100%" }}
                    >
                        {loading ? "Enviando..." : "Enviar Solicitud"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RegisterStoreScreen;
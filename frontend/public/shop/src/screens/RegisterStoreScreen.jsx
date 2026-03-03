import { useRegisterStore } from "../hooks/RegisterStores/useRegisterStore";
import { useRegisterStoreForm } from "../hooks/RegisterStores/useRegisterStoreForm";
import Stepper from "../components/registerStore/Stepper";
import Step1BasicInfo from "../components/RegisterStore/Step1BasicInfo";
import Step2Design from "../components/registerStore/Step2Design";
import Step3Credentials from "../components/registerStore/Step3Credentials";
import Step4VerifyEmail from "../components/registerStore/Step4VerifyEmail";
import "../styles/registerStore.css";

const RegisterStoreScreen = () => {
    const {
        step,
        loading,
        error,
        success,
        registeredEmail,
        step1,
        step2,
        step3,
        TEMPLATES,
        nextStep,
        prevStep,
        updateStep1,
        updateStep2,
        updateStep3,
        updateColor,
        handleSubmit,
        handleVerifySuccess,
    } = useRegisterStore();

    const { errors, clearErrors, validateStep1, validateStep3 } = useRegisterStoreForm();

    const handleNext = () => {
        clearErrors();
        if (step === 1) {
            if (validateStep1(step1)) nextStep();
        } else if (step === 2) {
            nextStep();
        }
    };

    const handleFinish = () => {
        clearErrors();
        if (validateStep3(step3)) handleSubmit();
    };

    if (success) {
        return (
            <div className="register-page">
                <div className="register-card">
                    <div className="success-screen">
                        <div className="success-icon">✓</div>
                        <h2>¡Tienda registrada!</h2>
                        <p>Tu tienda ha sido creada exitosamente.</p>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.href = "/login"}
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-header">
                    <h1>Registro de Nueva Tienda</h1>
                    <p>Complete los siguientes pasos para configurar su tienda</p>
                </div>

                <Stepper currentStep={step} />

                {error && <div className="error-banner">{error}</div>}

                {step === 1 && (
                    <Step1BasicInfo data={step1} errors={errors} onChange={updateStep1} />
                )}
                {step === 2 && (
                    <Step2Design
                        data={step2}
                        templates={TEMPLATES}
                        onSelectTemplate={(id) => updateStep2("design", id)}
                        onColorChange={updateColor}
                    />
                )}
                {step === 3 && (
                    <Step3Credentials data={step3} errors={errors} onChange={updateStep3} />
                )}
                {step === 4 && (
                    <Step4VerifyEmail
                        email={registeredEmail}
                        onSuccess={handleVerifySuccess}
                    />
                )}

                {step < 4 && (
                    <div className="btn-row">
                        {step > 1 && (
                            <button className="btn-secondary" onClick={prevStep}>
                                Anterior
                            </button>
                        )}
                        {step < 3 ? (
                            <button className="btn-primary" onClick={handleNext}>
                                Continuar
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={handleFinish}
                                disabled={loading}
                            >
                                {loading ? "Enviando código..." : "Finalizar Registro"}
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default RegisterStoreScreen;
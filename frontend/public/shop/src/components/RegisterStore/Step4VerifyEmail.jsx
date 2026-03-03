import { useVerifyEmail } from "../../hooks/useVerifyEmail";

const Step4VerifyEmail = ({ email, onSuccess }) => {
    const {
        code,
        loading,
        resendLoading,
        error,
        resendMsg,
        resendCooldown,
        inputsRef,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResend,
    } = useVerifyEmail(email, onSuccess);

    return (
        <div>
            <h2 className="section-title">Verifica tu Correo</h2>

            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                Enviamos un código de 6 dígitos a:
            </p>
            <p style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "var(--navy)",
                marginBottom: "28px",
                wordBreak: "break-all"
            }}>
                {email}
            </p>

            {/* Code inputs */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginBottom: "24px",
                }}
                onPaste={handlePaste}
            >
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        style={{
                            width: "48px",
                            height: "56px",
                            textAlign: "center",
                            fontSize: "1.4rem",
                            fontWeight: "700",
                            fontFamily: "'Sora', sans-serif",
                            border: `2px solid ${digit ? "var(--navy)" : "var(--border)"}`,
                            borderRadius: "10px",
                            background: digit ? "var(--white)" : "var(--bg)",
                            color: "var(--navy)",
                            outline: "none",
                            transition: "border-color 0.2s, background 0.2s",
                        }}
                    />
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="error-banner" style={{ marginBottom: "16px" }}>
                    {error}
                </div>
            )}

            {/* Resend message */}
            {resendMsg && (
                <p style={{
                    fontSize: "0.82rem",
                    color: "var(--success, #38a169)",
                    textAlign: "center",
                    marginBottom: "16px"
                }}>
                    {resendMsg}
                </p>
            )}

            {/* Verify button */}
            <button
                className="btn-primary"
                onClick={handleVerify}
                disabled={loading || code.join("").length < 6}
                style={{ width: "100%", marginBottom: "14px" }}
            >
                {loading ? "Verificando..." : "Verificar Código"}
            </button>

            {/* Resend */}
            <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    ¿No recibiste el código?{" "}
                </span>
                <button
                    onClick={handleResend}
                    disabled={resendLoading || resendCooldown > 0}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        color: resendCooldown > 0 ? "var(--text-muted)" : "var(--orange)",
                        padding: 0,
                    }}
                >
                    {resendLoading
                        ? "Enviando..."
                        : resendCooldown > 0
                        ? `Reenviar en ${resendCooldown}s`
                        : "Reenviar código"}
                </button>
            </div>
        </div>
    );
};

export default Step4VerifyEmail;
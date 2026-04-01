const TERMS_CONTENT = {
    acceptedTerms: {
        title: "Terminos y Condiciones",
        content: `
Al registrarte como vendedor en Sooki, aceptas cumplir con todas las normas establecidas en esta plataforma.

1. Uso de la plataforma
Sooki es una plataforma de comercio electronico que conecta vendedores y compradores. Como vendedor, eres responsable de la informacion que publicas y de los productos que ofreces.

2. Responsabilidades del vendedor
- Proporcionar informacion veraz sobre tus productos.
- Cumplir con los tiempos de entrega acordados.
- Mantener comunicacion activa con los compradores.
- Gestionar devoluciones y reclamos de manera oportuna.

3. Comisiones y pagos
Sooki aplica una comision sobre cada venta realizada. Los pagos se procesaran segun el calendario acordado al momento de la activacion de tu cuenta.

4. Suspension de cuenta
Sooki se reserva el derecho de suspender o cancelar cuentas que incumplan estos terminos.
        `
    },
    acceptedPrivacyPolicy: {
        title: "Politica de Privacidad",
        content: `
En Sooki tomamos muy en serio la privacidad de tus datos personales.

1. Datos que recopilamos
Recopilamos informacion personal como nombre, correo electronico, numero de telefono, documento de identidad e informacion bancaria unicamente con el fin de verificar tu identidad y procesar pagos.

2. Uso de los datos
Tus datos seran utilizados exclusivamente para:
- Verificar tu identidad como vendedor.
- Procesar pagos y transferencias.
- Comunicarnos contigo sobre el estado de tu cuenta.

3. Proteccion de datos
Toda la informacion sensible es encriptada y almacenada de forma segura. No compartimos tus datos con terceros sin tu consentimiento.

4. Derechos del usuario
Tienes derecho a solicitar la eliminacion o modificacion de tus datos personales en cualquier momento.
        `
    },
    acceptedSellerPolicy: {
        title: "Politica del Vendedor",
        content: `
Como vendedor en Sooki, debes cumplir con las siguientes politicas:

1. Calidad del servicio
- Responder mensajes de clientes en un plazo maximo de 24 horas.
- Empacar los productos de forma adecuada para evitar danos durante el envio.
- Notificar al cliente cuando su pedido sea despachado.

2. Precios y disponibilidad
- Los precios publicados deben ser precisos y actualizados.
- Si un producto no esta disponible, debes retirarlo o marcarlo como agotado inmediatamente.

3. Valoraciones y resenas
- No esta permitido manipular las valoraciones de tu tienda.
- Las resenas negativas deben ser atendidas de forma profesional.

4. Sanciones
El incumplimiento de esta politica puede resultar en advertencias, suspension temporal o eliminacion permanente de tu cuenta.
        `
    },
    acceptedProhibitedProducts: {
        title: "Politica de Productos Prohibidos",
        content: `
Queda estrictamente prohibido vender los siguientes tipos de productos en Sooki:

1. Productos ilegales
- Sustancias controladas o drogas de cualquier tipo.
- Armas de fuego, municiones o explosivos sin la debida autorizacion legal.
- Productos falsificados o que infrinjan derechos de propiedad intelectual.

2. Productos peligrosos
- Materiales quimicos peligrosos sin la regulacion correspondiente.
- Productos sin certificacion de seguridad requerida por la ley.

3. Contenido inapropiado
- Material para adultos sin la debida clasificacion y restriccion de edad.
- Contenido que promueva el odio, discriminacion o violencia.

4. Otros productos restringidos
- Medicamentos de venta con receta sin autorizacion.
- Animales silvestres o en peligro de extincion.

El incumplimiento de esta politica resultara en la suspension inmediata de tu cuenta y podra derivar en acciones legales.
        `
    },
};

const TermsModal = ({ termKey, onClose }) => {
    const content = TERMS_CONTENT[termKey];
    if (!content) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(27,43,68,0.6)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                animation: "cardIn 0.2s ease",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: "#fff",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "560px",
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 40px rgba(27,43,68,0.2)",
            }}>
                {/* Header */}
                <div style={{
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <h3 style={{
                        margin: 0,
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "1rem",
                        fontWeight: "700",
                        color: "var(--navy)",
                    }}>
                        {content.title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: "var(--text-muted)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                        }}
                    >
                        x
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: "20px 24px",
                    overflowY: "auto",
                    flex: 1,
                }}>
                    <pre style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        lineHeight: "1.7",
                        whiteSpace: "pre-wrap",
                        margin: 0,
                    }}>
                        {content.content.trim()}
                    </pre>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "16px 24px",
                    borderTop: "1px solid var(--border)",
                    textAlign: "right",
                }}>
                    <button
                        onClick={onClose}
                        className="btn-primary"
                        style={{ width: "auto", padding: "10px 28px" }}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
const Step3Credentials = ({ data, errors, onChange }) => {
    return (
        <div>
            <h2 className="section-title">Credenciales de Acceso</h2>

            {/* Email */}
            <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={data.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            {/* Username */}
            <div className="form-group">
                <label>Usuario</label>
                <input
                    type="text"
                    placeholder="Ingrese su nombre de usuario"
                    value={data.username}
                    onChange={(e) => onChange("username", e.target.value)}
                    className={errors.username ? "input-error" : ""}
                />
                {errors.username && <span className="error-msg">{errors.username}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
                <label>Contraseña</label>
                <input
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={data.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    className={errors.password ? "input-error" : ""}
                />
                {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                    type="password"
                    placeholder="Confirme su contraseña"
                    value={data.confirmPassword}
                    onChange={(e) => onChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "input-error" : ""}
                />
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
            </div>
        </div>
    );
};

export default Step3Credentials;
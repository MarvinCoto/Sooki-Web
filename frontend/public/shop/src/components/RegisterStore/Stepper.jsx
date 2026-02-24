import { Fragment } from "react";

const steps = [
    { number: 1, label: "Información Básica" },
    { number: 2, label: "Diseño y Plantilla" },
    { number: 3, label: "Credenciales" },
];

const Stepper = ({ currentStep }) => {
    return (
        <div className="stepper">
            {steps.map((s, i) => (
                <Fragment key={s.number}>
                    <div
                        className={`stepper-item ${
                            currentStep === s.number
                                ? "active"
                                : currentStep > s.number
                                ? "completed"
                                : ""
                        }`}
                    >
                        <div className="stepper-circle">{s.number}</div>
                        <span className="stepper-label">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className={`stepper-line ${currentStep > s.number ? "completed" : ""}`}
                        />
                    )}
                </Fragment>
            ))}
        </div>
    );
};

export default Stepper;